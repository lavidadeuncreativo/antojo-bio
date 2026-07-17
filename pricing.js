(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ANTOJO_PRICING=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const STANDARD_RANGES=[
    {min:1,max:5,unitPrice:65,name:'1–5 piezas'},
    {min:6,max:10,unitPrice:60,name:'6–10 piezas'},
    {min:11,max:20,unitPrice:58,name:'11–20 piezas'},
    {min:21,max:49,unitPrice:55,name:'21–49 piezas'},
    {min:50,max:99,unitPrice:53,name:'50–99 piezas'},
    {min:100,max:149,unitPrice:52,name:'100–149 piezas'},
    {min:150,max:1000,unitPrice:50,name:'150–1,000 piezas'}
  ];
  const PERSONALIZED_RANGES=[
    {min:50,max:99,unitPrice:65,name:'50–99 piezas personalizadas'},
    {min:100,max:149,unitPrice:62,name:'100–149 piezas personalizadas'},
    {min:150,max:1000,unitPrice:60,name:'150–1,000 piezas personalizadas'}
  ];

  function normalizeQuantity(value){
    const quantity=Number(value);
    return Number.isFinite(quantity)?Math.floor(quantity):0;
  }

  function getPricing(quantity,isPersonalized){
    const qty=normalizeQuantity(quantity);
    const personalized=Boolean(isPersonalized);
    if(qty<1){
      return {quantity:qty,isPersonalized:personalized,unitPrice:null,subtotal:null,deposit:null,balance:null,rangeName:'Cantidad inválida',needsHumanReview:false,isValid:false,error:'La cantidad debe ser mayor a cero.'};
    }
    if(personalized&&qty<50){
      return {quantity:qty,isPersonalized:true,unitPrice:null,subtotal:null,deposit:null,balance:null,rangeName:'Mínimo 50 piezas',needsHumanReview:false,isValid:false,error:'La personalización está disponible a partir de 50 piezas.'};
    }
    if(qty>1000){
      return {quantity:qty,isPersonalized:personalized,unitPrice:null,subtotal:null,deposit:null,balance:null,rangeName:'Cotización especial',needsHumanReview:true,isValid:true,error:''};
    }
    const range=(personalized?PERSONALIZED_RANGES:STANDARD_RANGES).find(item=>qty>=item.min&&qty<=item.max);
    if(!range){
      return {quantity:qty,isPersonalized:personalized,unitPrice:null,subtotal:null,deposit:null,balance:null,rangeName:'Cotización especial',needsHumanReview:true,isValid:true,error:''};
    }
    const subtotal=qty*range.unitPrice;
    const deposit=subtotal/2;
    return {quantity:qty,isPersonalized:personalized,unitPrice:range.unitPrice,subtotal,deposit,balance:subtotal-deposit,rangeName:range.name,needsHumanReview:false,isValid:true,error:''};
  }

  function parseISODate(value){
    const text=String(value||'');
    const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if(!match)return null;
    const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
    const date=new Date(Date.UTC(year,month-1,day));
    if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
    return date;
  }

  function mexicoDateISO(now){
    const date=now instanceof Date?now:new Date(now||Date.now());
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function calendarDaysBetween(startISO,endISO){
    const start=parseISODate(startISO),end=parseISODate(endISO);
    if(!start||!end)return null;
    return Math.round((end-start)/86400000);
  }

  function businessDaysBetween(startISO,endISO){
    const start=parseISODate(startISO),end=parseISODate(endISO);
    if(!start||!end)return null;
    if(end<start)return-1;
    let count=0;
    const cursor=new Date(start.getTime());
    while(cursor<end){
      cursor.setUTCDate(cursor.getUTCDate()+1);
      const day=cursor.getUTCDay();
      if(day!==0&&day!==6)count+=1;
    }
    return count;
  }

  function getDateStatus(value,isPersonalized,todayISO){
    const dateISO=String(value||'');
    const today=String(todayISO||mexicoDateISO());
    const parsed=parseISODate(dateISO);
    if(!parsed)return {isValid:false,isPast:false,isUrgent:false,needsReview:false,message:'Selecciona una fecha válida.',calendarDays:null,businessDays:null};
    const calendarDays=calendarDaysBetween(today,dateISO);
    const businessDays=businessDaysBetween(today,dateISO);
    if(calendarDays===null||calendarDays<0)return {isValid:false,isPast:true,isUrgent:false,needsReview:false,message:'La fecha no puede estar en el pasado.',calendarDays,businessDays};
    const personalized=Boolean(isPersonalized);
    const urgent=personalized?businessDays<5:calendarDays<2;
    return {
      isValid:true,
      isPast:false,
      isUrgent:urgent,
      needsReview:urgent,
      calendarDays,
      businessDays,
      message:urgent?'Esta fecha necesita validación especial por el tiempo de producción. Puedes continuar, pero todavía no está confirmada.':''
    };
  }

  function getSelectionStatus(selected,target){
    const selectedQty=normalizeQuantity(selected),targetQty=normalizeQuantity(target);
    const difference=selectedQty-targetQty;
    return {selected:selectedQty,target:targetQty,difference,isExact:targetQty>0&&difference===0,remaining:Math.max(0,-difference),extra:Math.max(0,difference)};
  }

  return {STANDARD_RANGES,PERSONALIZED_RANGES,getPricing,parseISODate,mexicoDateISO,calendarDaysBetween,businessDaysBetween,getDateStatus,getSelectionStatus};
});
