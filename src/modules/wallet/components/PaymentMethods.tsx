import React from 'react';
import { Smartphone, Plus, CheckCircle2, MoreVertical } from 'lucide-react';

const METHODS = [
  { id: '1', provider: 'bKash', number: '017****4528', type: 'MFS', isDefault: true, color: 'bg-rose-500' },
  { id: '2', provider: 'Nagad', number: '019****1122', type: 'MFS', isDefault: false, color: 'bg-orange-500' },
];

export const PaymentMethods = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Link Payment Methods</h4>
        <button className="text-[10px] font-black text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors">
          <Plus className="w-3 h-3" /> ADD NEW
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {METHODS.map((method) => (
          <div 
            key={method.id} 
            className="group relative overflow-hidden rounded-[24px] bg-white/[0.03] border border-white/5 p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-orange-500/20 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${method.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                 <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{method.provider}</span>
                  {method.isDefault && (
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black uppercase">Active</span>
                  )}
                </div>
                <p className="text-[10px] text-white/40 font-bold tracking-widest mt-0.5">{method.number}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               {method.isDefault && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
               <button className="p-2 text-white/20 group-hover:text-white/60">
                  <MoreVertical className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
