window.SalaryCalculator = (function() {
  
  function findNextOrExact(amount, steps) {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] >= amount) return { step: i + 1, pay: steps[i] };
    }
    return { step: steps.length, pay: steps[steps.length - 1] };
  }

  function getOldBasicAt(steps, currentBasic, incrementsCount) {
    const idx = steps.indexOf(currentBasic);
    if (idx === -1) return currentBasic;
    return steps[Math.min(idx + incrementsCount, steps.length - 1)];
  }

  function fixBase(oldBasic, g, scales) {
    const d = scales[g];
    if (oldBasic === d.old[0]) {
      return { step: 1, pay: d.new[0], rule: 'ক', delta: 0, provisional: d.new[0] };
    }
    const delta = oldBasic - d.old[0];
    const provisional = d.new[0] + delta;
    const m = findNextOrExact(provisional, d.new);
    return {
      step: m.step,
      pay: m.pay,
      rule: d.new.includes(provisional) ? 'খ (হুবহু)' : 'খ (পরবর্তী উচ্চতর)',
      delta,
      provisional
    };
  }

  function addIncrement(baseStep, g, scales) {
    const steps = scales[g].new;
    if (baseStep < steps.length) {
      return { step: baseStep + 1, pay: steps[baseStep] };
    }
    return { step: baseStep, pay: steps[baseStep - 1] };
  }

  function phaseList(g) {
    const p1 = g <= 9 ? 40 : 50;
    const p2 = g <= 9 ? 70 : 75;
    return [
      { id: 1, label: '১ম ধাপ (১ জুলাই ২০২৬ - ৩১ ডিসেম্বর ২০২৬)', note: 'ফিক্সেশন ও ১ জুলাই ২৬ ইনক্রিমেন্টসহ', pct: p1, isFull: false, fullAllow: false },
      { id: 2, label: '২য় ধাপ (১ জানুয়ারি ২০২৭ - ৩০ জুন ২০২৭)', note: 'অর্ধেক বাড়তি', pct: p2, isFull: false, fullAllow: false },
      { id: 3, label: '৩য় ধাপ (১ জুলাই ২০২৭ থেকে)', note: '১০০% ও ২০২৭ ইনক্রিমেন্টসহ', pct: 100, isFull: true, fullAllow: false },
      { id: 4, label: '৪র্থ ধাপ (১ জানুয়ারি ২০২৮ থেকে)', note: 'পূর্ণাঙ্গ ও ২০২৭ ইনক্রিমেন্টসহ', pct: 100, isFull: true, fullAllow: true }
    ];
  }

  function allowancesFor(payAmt, isOldRates, currentOldBasicRef, g, area, age, govHouse, wantTiffin, allowData) {
    if (isOldRates) {
      let slab = allowData.hra2015.find(s => currentOldBasicRef <= s.maxBasic);
      let rawHra = Math.round(currentOldBasicRef * slab[area].pct / 100);
      let finalHra = govHouse ? 0 : Math.max(rawHra, slab[area].min); 
      
      const med = 1500; 
      const tiff = (wantTiffin && g >= 11) ? 200 : 0; 
      return { hra: finalHra, medical: med, tiffin: tiff, total: finalHra + med + tiff };
    } else {
      let slab = allowData.hra2026.find(s => g >= s.minGrade && g <= s.maxGrade);
      let finalHra = govHouse ? 0 : Math.round(payAmt * slab[area].pct / 100);
      
      const med = age === 'under50' ? 3000 : 4000; 
      const tiff = (wantTiffin && g >= 11) ? 500 : 0;
      return { hra: finalHra, medical: med, tiffin: tiff, total: finalHra + med + tiff };
    }
  }

  function calculate(params) {
    const { g, oldBasic, area, age, govHouse, wantTiffin, scales, allowData } = params;

    const base = fixBase(oldBasic, g, scales);
    const withInc26 = addIncrement(base.step, g, scales); 
    const targetNew26 = withInc26.pay; 

    const withInc27 = addIncrement(withInc26.step, g, scales);
    const targetNew27 = withInc27.pay; 

    const fixIncrease = base.pay - oldBasic;
    const fixPct = ((fixIncrease / oldBasic) * 100).toFixed(1);
    const incAmount = targetNew26 - base.pay;
    
    const oldSteps = scales[g].old;
    const oldJul26Basic = getOldBasicAt(oldSteps, oldBasic, 1);
    const oldJul27Basic = getOldBasicAt(oldSteps, oldBasic, 2);

    const oldStart = oldSteps[0];
    const newStart = scales[g].new[0];
    const ratio = newStart / oldStart;

    // IDEAL PROPORTIONAL CALCULATION (Base fixed ONCE, then step increments)
    const idealBaseRaw = Math.round(oldBasic * ratio);
    const idealBase = findNextOrExact(idealBaseRaw, scales[g].new);

    const idealInc26 = addIncrement(idealBase.step, g, scales);
    const idealJul26Full = idealInc26.pay;

    const idealInc27 = addIncrement(idealInc26.step, g, scales);
    const idealJul27Full = idealInc27.pay;

    const phases = phaseList(g);

    const phaseResults = phases.map(p => {
      let pay, idealPhasePay, oldRefBasic;

      if (p.id === 1 || p.id === 2) {
        pay = oldBasic + Math.round((targetNew26 - oldBasic) * p.pct / 100);
        idealPhasePay = oldBasic + Math.round((idealJul26Full - oldBasic) * p.pct / 100);
        oldRefBasic = oldJul26Basic; 
      } else {
        pay = targetNew27;
        idealPhasePay = idealJul27Full; 
        oldRefBasic = oldJul27Basic;    
      }

      const isOld = !p.fullAllow;
      const alw = allowancesFor(pay, isOld, oldRefBasic, g, area, age, govHouse, wantTiffin, allowData);
      const phaseGross = pay + alw.total;

      const ratioAlw = allowancesFor(idealPhasePay, isOld, oldRefBasic, g, area, age, govHouse, wantTiffin, allowData);
      const ratioGross = idealPhasePay + ratioAlw.total;
      
      const basicLoss = idealPhasePay - pay;
      const grossLoss = ratioGross - phaseGross;

      return {
        ...p,
        pay, idealPhasePay, oldRefBasic,
        alw, ratioAlw,
        phaseGross, ratioGross,
        basicLoss, grossLoss
      };
    });

    return {
      base,
      withInc26,
      targetNew26,
      withInc27,
      targetNew27,
      fixIncrease,
      fixPct,
      incAmount,
      phaseResults
    };
  }

  return {
    calculate: calculate
  };
})();