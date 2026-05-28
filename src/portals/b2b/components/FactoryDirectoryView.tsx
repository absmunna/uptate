import React, { useState, useMemo } from 'react';
import { 
  Building2, Search, ShieldCheck, Star, MapPin, Map,
  CheckCircle, ArrowLeft, ArrowUpRight, Plus, Sliders, Settings, Users
} from 'lucide-react';
import { MOCK_B2B_VENDORS } from '../constants/b2bData';

interface FactoryDirectoryViewProps {
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
}

export const FactoryDirectoryView: React.FC<FactoryDirectoryViewProps> = ({ onNavigate, onBack }) => {
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Filter factories
  const factories = useMemo(() => {
    return MOCK_B2B_VENDORS.filter(vendor => {
      // Must be factory or exporter trading as factory unit
      if (vendor.type !== 'factory' && vendor.type !== 'exporter') {
        return false;
      }
      
      const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase()) || 
                            vendor.location.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedIndustry !== 'all' && vendor.industry.toLowerCase() !== selectedIndustry.toLowerCase()) {
        return false;
      }

      if (verifiedOnly && !vendor.isVerified) {
        return false;
      }

      return true;
    });
  }, [search, selectedIndustry, verifiedOnly]);

  return (
    <div className="space-y-5">
      {/* Header back & title */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">Portal Main</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Industrial Directory ({factories.length} mills)</span>
      </div>

      {/* 1. Directory Search bar */}
      <div className="flex gap-2 rounded-2xl p-2 border"
        style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="flex-1 flex items-center gap-2 pl-2">
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)] shrink-0" />
          <input
            type="text"
            placeholder="Search factories, looms, spinners, zones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none text-[var(--pm-text)]"
          />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-[var(--pm-text-secondary)] pr-2 hover:text-white font-black">
            Clear
          </button>
        )}
      </div>

      {/* 2. Micro Filter Bar */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[var(--pm-text-secondary)] font-semibold">specialty:</span>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-transparent border border-white/5 text-white/90 text-[11px] font-extrabold py-1 px-2 rounded-lg outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#111]">All Industries</option>
            <option value="Garments" className="bg-[#111]">Garments</option>
            <option value="Agro" className="bg-[#111]">Agro Procs</option>
            <option value="Electronics" className="bg-[#111]">Electronics</option>
          </select>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-white/90">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-[var(--pm-accent)] rounded w-3.5 h-3.5"
          />
          <span>Gold Verified Mills</span>
        </label>
      </div>

      {/* 3. Factory list output */}
      {factories.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <p className="text-xs font-black text-white/50">রোল বা লোকেটেড এই এরিয়াতে কোনো ভেরিফাইড ফ্যাক্টরি পাওয়া যায় নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factories.map(fac => (
            <div
              key={fac.id}
              onClick={() => onNavigate('factory-profile', fac.id)}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4 rounded-2xl hover:border-[var(--pm-accent)]/30 cursor-pointer transition flex gap-3 relative overflow-hidden group"
            >
              {/* Image banner thumb */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/25">
                <img src={fac.logo} alt={fac.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-1.5 py-0.2 rounded font-black uppercase text-[7.5px]">
                        {fac.industry}
                      </span>
                      {fac.isVerified && (
                        <span className="text-[7.5px] px-1 py-0.2 rounded bg-orange-600/15 text-orange-400 font-extrabold flex items-center border border-orange-500/15 uppercase">
                          <CheckCircle className="w-2.5 h-2.5 mr-0.5 fill-none" /> Certified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {fac.rating}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-white group-hover:text-[var(--pm-accent)] transition mt-1.5 leading-snug truncate">
                    {fac.name}
                  </h3>
                  
                  <p className="text-[10px] text-[var(--pm-text-secondary)] font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" /> {fac.location}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[9.5px]">
                  <span className="text-[var(--pm-text-secondary)]">Established: {fac.establishedYear}</span>
                  <span className="text-white font-bold flex items-center gap-0.5">
                    <Users className="w-3 h-3 text-cyan-400" /> {fac.employeeCount} Workers
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* bottom info card */}
      <div className="p-4 bg-linear-to-br from-[#121422] to-[#161a35] border border-white/5 rounded-2xl text-center space-y-2">
        <h4 className="text-xs font-black text-white">Own a manufacturing / milling mill?</h4>
        <p className="text-[10px] text-white/50 leading-relaxed">
          আপলোড করুন ট্রেড লাইসেন্স এবং রপ্তানি সার্টিফিকেট ও আবেদন করুন পাইকার মার্ট ভেরিফাইড সাপ্লায়ার ব্যাজের জন্য।
        </p>
        <button 
          onClick={() => onNavigate('feed')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] rounded-xl tracking-wider transition-all"
        >
          Factory Registration Guide
        </button>
      </div>
    </div>
  );
};
