import { useState, useEffect } from 'react';
import { differenceInDays, addYears, setYear, isBefore, startOfDay, format } from 'date-fns';

// ───────────────────────────────── Types ─────────────────────────────────────

interface Birthday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  message: string;
  photoUrl: string;
}

type View = 'dashboard' | 'add' | 'detail';

// ─────────────────────────────── Sample Data ──────────────────────────────────

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1530103862676-de88b776f827?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531956627045-8025211cc5fa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561992015-ad69d3df3985?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop',
];

const INITIAL_BIRTHDAYS: Birthday[] = [
  {
    id: '1',
    name: 'Tebogo',
    date: '1992-08-15',
    message: 'Wishing our favorite adventurous spirit the best birthday ever!',
    photoUrl: PRESET_PHOTOS[0],
  },
  {
    id: '2',
    name: 'Kaku',
    date: '1965-09-02',
    message: 'Happy birthday to the pillar of our family. We love you so much!',
    photoUrl: PRESET_PHOTOS[1],
  },
  {
    id: '3',
    name: 'Seemisho',
    date: '1998-07-29',
    message: 'Another year older, another year wiser. Have a great one bro!',
    photoUrl: PRESET_PHOTOS[2],
  },
  {
    id: '4',
    name: 'Hlare',
    date: '1978-08-12',
    message: 'Another year older, another year wiser. Have a great one bro!',
    photoUrl: PRESET_PHOTOS[2],
  },
];

// ──────────────────────────────── Utils ───────────────────────────────────────

function getBirthdayInfo(dateStr: string) {
  if (!dateStr) return { daysRemaining: 0, progress: 0, nextDate: new Date(), ageTurn: 0 };
  
  const today = startOfDay(new Date());
  const birthDate = startOfDay(new Date(dateStr));
  
  let nextBday = setYear(birthDate, today.getFullYear());
  
  if (isBefore(nextBday, today)) {
    nextBday = addYears(nextBday, 1);
  }
  
  const daysRemaining = differenceInDays(nextBday, today);
  const progress = Math.max(0, Math.min(100, ((365 - daysRemaining) / 365) * 100));
  const ageTurn = nextBday.getFullYear() - birthDate.getFullYear();
  
  let status = 'Upcoming';
  let colorClass = 'bg-accent text-foreground';
  let barColor = 'bg-accent';
  
  if (daysRemaining === 0) {
    status = 'Today! 🎊';
    colorClass = 'bg-primary text-primary-foreground';
    barColor = 'bg-primary';
  } else if (daysRemaining > 30) {
    status = 'Waiting';
    colorClass = 'bg-muted text-muted-foreground';
    barColor = 'bg-muted-foreground/30';
  }
  
  return { daysRemaining, progress, nextDate: nextBday, ageTurn, status, colorClass, barColor };
}

// ────────────────────────────── Small Components ──────────────────────────────

function WhatsAppButton({ birthday, daysRemaining, ageTurn }: { birthday: Birthday, daysRemaining: number, ageTurn: number }) {
  let text = '';
  if (daysRemaining === 0) {
    text = `🎊 Happy ${ageTurn}th Birthday, ${birthday.name}! 🎊\n\n${birthday.message}\n\nLet's all wish them a wonderful day!`;
  } else {
    text = `Hey family, just a reminder that ${birthday.name}'s ${ageTurn}th birthday is in ${daysRemaining} days! 🎂`;
  }
  
  const encodedText = encodeURIComponent(text);
  const href = `https://wa.me/?text=${encodedText}`;

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl font-medium shadow-sm active:scale-95 transition-transform"
      onClick={(e) => e.stopPropagation()}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.881-.733-1.476-1.639-1.649-1.937-.173-.298-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
      </svg>
      Notify Family
    </a>
  );
}

// ─────────────────────────────── Main Components ────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [birthdays, setBirthdays] = useState<Birthday[]>(INITIAL_BIRTHDAYS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedBirthday = birthdays.find(b => b.id === selectedId);

  // Sort birthdays by days remaining
  const sortedBirthdays = [...birthdays].sort((a, b) => {
    return getBirthdayInfo(a.date).daysRemaining - getBirthdayInfo(b.date).daysRemaining;
  });

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative overflow-hidden flex flex-col" style={{ boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px, rgba(0, 0, 0, 0.01) 0px 4px 4px 0px inset' }}>
      
      {/* ─── Dashboard ───────────────────────────────────────────────────────── */}
      {view === 'dashboard' && (
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Family Traditions</p>
              <h1 className="font-serif text-4xl font-bold text-foreground">Birthdays</h1>
            </div>
            <button 
              onClick={() => setView('add')}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform"
            >
              +
            </button>
          </div>

          <div className="space-y-4">
            {sortedBirthdays.map((bday) => {
              const info = getBirthdayInfo(bday.date);
              
              return (
                <div 
                  key={bday.id} 
                  onClick={() => { setSelectedId(bday.id); setView('detail'); }}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex gap-4 items-center">
                    <img src={bday.photoUrl} alt={bday.name} className="w-16 h-16 rounded-full object-cover shadow-inner bg-muted" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif font-bold text-xl text-foreground truncate pr-2">{bday.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${info.colorClass}`}>
                          {info.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 font-medium">
                        Turns {info.ageTurn} • {format(info.nextDate, 'MMM do')}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${info.barColor}`} 
                            style={{ width: `${info.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold font-serif whitespace-nowrap w-20 text-right">
                          {info.daysRemaining === 0 ? 'Today!' : `${info.daysRemaining} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {sortedBirthdays.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="text-5xl mb-4 opacity-50">🎂</div>
                <h3 className="font-serif text-xl font-bold mb-2">No birthdays yet</h3>
                <p className="text-muted-foreground text-sm">Add your family members to start tracking and celebrating together.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Detail View ─────────────────────────────────────────────────────── */}
      {view === 'detail' && selectedBirthday && (
        <div className="absolute inset-0 bg-background flex flex-col z-10 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
          <div className="relative h-72">
            <img src={selectedBirthday.photoUrl} alt={selectedBirthday.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            
            <button 
              onClick={() => { setView('dashboard'); setSelectedId(null); }}
              className="absolute top-6 left-4 w-10 h-10 bg-white/30 backdrop-blur-md text-foreground rounded-full flex items-center justify-center font-bold"
            >
              ←
            </button>
          </div>
          
          <div className="px-6 relative -mt-16 flex-1 flex flex-col pb-12">
            <div className="bg-card rounded-3xl p-6 shadow-xl border border-border mb-6 text-center">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-1">{selectedBirthday.name}</h2>
              <p className="text-muted-foreground font-medium mb-6">
                Born {format(new Date(selectedBirthday.date), 'MMMM do, yyyy')}
              </p>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-6xl font-serif font-black text-primary leading-none mb-2">
                  {getBirthdayInfo(selectedBirthday.date).daysRemaining}
                </span>
                <span className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
                  Days Left
                </span>
              </div>
              
              <WhatsAppButton 
                birthday={selectedBirthday} 
                daysRemaining={getBirthdayInfo(selectedBirthday.date).daysRemaining} 
                ageTurn={getBirthdayInfo(selectedBirthday.date).ageTurn} 
              />
            </div>
            
            <div className="mb-8">
              <h3 className="font-serif text-xl font-bold mb-3">Celebration Message</h3>
              <div className="bg-muted p-5 rounded-2xl rounded-tl-none">
                <p className="text-foreground/80 leading-relaxed italic">
                  "{selectedBirthday.message}"
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (confirm('Are you sure you want to remove this birthday?')) {
                  setBirthdays(prev => prev.filter(b => b.id !== selectedBirthday.id));
                  setView('dashboard');
                  setSelectedId(null);
                }
              }}
              className="mt-auto py-3 text-red-500 font-medium tracking-wide active:opacity-70"
            >
              Remove Family Member
            </button>
          </div>
        </div>
      )}

      {/* ─── Add Birthday ────────────────────────────────────────────────────── */}
      {view === 'add' && (
        <div className="absolute inset-0 bg-background flex flex-col z-10 overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
          <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-20">
            <button 
              onClick={() => setView('dashboard')}
              className="text-muted-foreground font-medium"
            >
              Cancel
            </button>
            <h2 className="font-serif text-xl font-bold">New Birthday</h2>
            <div className="w-12" style={{ backgroundColor: 'rgba(210, 74, 217, 0.79)' }}></div> {/* Spacer for centering */}
          </div>
          
          <div className="px-6 flex-1 flex flex-col pb-12">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const newBday: Birthday = {
                  id: Date.now().toString(),
                  name: fd.get('name') as string,
                  date: fd.get('date') as string,
                  message: fd.get('message') as string,
                  photoUrl: fd.get('photoUrl') as string,
                };
                setBirthdays(prev => [...prev, newBday]);
                setView('dashboard');
              }}
              className="flex-1 flex flex-col space-y-6"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Name</label>
                <input 
                  required
                  name="name"
                  placeholder="e.g. Aunt Sarah"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Birth Date</label>
                <input 
                  required
                  type="date"
                  name="date"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Celebration Message</label>
                <textarea 
                  required
                  name="message"
                  placeholder="A lovely message to share with the family..."
                  rows={3}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 font-medium resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Choose a Photo</label>
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_PHOTOS.map((url, i) => (
                    <label key={url} className="relative cursor-pointer aspect-square rounded-xl overflow-hidden block">
                      <input type="radio" name="photoUrl" value={url} defaultChecked={i === 0} className="peer sr-only" />
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border-4 border-transparent peer-checked:border-primary rounded-xl transition-colors" />
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-md active:scale-[0.98] transition-transform"
              >
                Save Family Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
