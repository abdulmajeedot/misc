/* Shared sample data for PumpBOM prototypes. Replace with API calls (/api/materials, /api/products, /api/plan). */
const SEC = {
  MOTOR:{label:'Motor Side', c:'#2f6fb3', bg:'#e6eef9'},
  PUMP: {label:'Pump Side',  c:'#c55a11', bg:'#fcece0'},
  PANEL:{label:'Panel Side', c:'#7030a0', bg:'#f1e8f8'},
  PACK: {label:'Packing & Hardware', c:'#5f6b73', bg:'#eceff1'}
};
const SECORD = ['MOTOR','PUMP','PANEL','PACK'];
const MAT = {};
function m(code,desc,sec,sub,uom,rate,stock,po,sup,lead,moq,mb='Buy'){MAT[code]={code,desc,sec,sub,uom,rate,stock,po,sup,lead,moq,mb};}
// code, description, section, sub-assembly, UOM, rate ₹, stock, open PO, supplier, lead days, MOQ, make/buy
m('M-STP-100','Stator stamping set, 100 mm stack','MOTOR','Stator','SET',1450,180,100,'Sri Lakshmi Stampings',12,25);
m('M-STP-150','Stator stamping set, 150 mm stack','MOTOR','Stator','SET',1980,60,50,'Sri Lakshmi Stampings',12,25);
m('M-STP-V4','Stator stamping set, V4 submersible','MOTOR','Stator','SET',1350,220,0,'Sri Lakshmi Stampings',12,50);
m('M-CUW-22','Copper winding wire, 22 SWG (enamelled)','MOTOR','Stator','KG',890,340,200,'Hindustan Copper Traders',7,50);
m('M-CUW-24','Copper winding wire, 24 SWG (enamelled)','MOTOR','Stator','KG',905,260,0,'Hindustan Copper Traders',7,50);
m('M-CUW-PVC','Winding wire, PVC insulated 1.0 mm','MOTOR','Stator','KG',960,300,150,'Hindustan Copper Traders',10,50);
m('M-INS-01','Insulation kit, slot paper, sleeves, varnish','MOTOR','Stator','SET',180,260,0,'Insulcraft Supplies',5,100);
m('M-ROT-100','Rotor, die-cast aluminium, 100 mm','MOTOR','Rotor & Shaft','NOS',1250,200,60,'Coimbatore Castings',15,25);
m('M-ROT-150','Rotor, die-cast aluminium, 150 mm','MOTOR','Rotor & Shaft','NOS',1690,40,40,'Coimbatore Castings',15,25);
m('M-ROT-V4','Rotor, V4 submersible','MOTOR','Rotor & Shaft','NOS',980,180,0,'Coimbatore Castings',15,50);
m('M-SFT-24','Shaft EN8, Ø24 mm','MOTOR','Rotor & Shaft','NOS',420,260,0,'In-house machine shop',4,1,'Make');
m('M-SFT-28','Shaft SS410, Ø28 mm','MOTOR','Rotor & Shaft','NOS',780,90,0,'In-house machine shop',4,1,'Make');
m('M-SFT-V4','Shaft SS410, V4 submersible','MOTOR','Rotor & Shaft','NOS',650,320,0,'In-house machine shop',4,1,'Make');
m('M-BRG-6204','Ball bearing, 6204 ZZ','MOTOR','Bearings','NOS',95,600,0,'Bearing Distributors Pvt Ltd',5,100);
m('M-BRG-6205','Ball bearing, 6205 ZZ','MOTOR','Bearings','NOS',120,220,0,'Bearing Distributors Pvt Ltd',5,100);
m('M-BRG-6306','Ball bearing, 6306 2RS','MOTOR','Bearings','NOS',310,70,100,'Bearing Distributors Pvt Ltd',5,50);
m('M-BRG-THR','Thrust bearing assembly, V4','MOTOR','Bearings','NOS',420,140,100,'Bearing Distributors Pvt Ltd',21,50);
m('M-BDY-01','Motor body, cast iron','MOTOR','Housing','NOS',980,420,0,'Coimbatore Castings',20,25);
m('M-BDY-V4','Motor shell, SS304, V4','MOTOR','Housing','NOS',1100,250,0,'Steelform Fabricators',18,25);
m('M-ESH-01','End shield DE / NDE, cast iron','MOTOR','Housing','NOS',260,700,0,'Coimbatore Castings',20,50);
m('M-FAN-01','Cooling fan, polypropylene','MOTOR','Housing','NOS',45,300,0,'Plastomould Industries',6,200);
m('M-FCV-01','Fan cover, pressed steel','MOTOR','Housing','NOS',85,250,0,'Plastomould Industries',6,100);
m('M-TBX-01','Terminal box, with cover','MOTOR','Housing','NOS',110,180,0,'Plastomould Industries',6,100);
m('M-CAP-36','Run capacitor, 36 µF 440 V','MOTOR','Electrical','NOS',240,150,200,'Elmex Electricals',10,100);
m('P-IMP-MB5','Impeller, bronze, MBP 5 HP','PUMP','Hydraulics','NOS',1150,60,40,'In-house foundry',8,10,'Make');
m('P-IMP-MB3','Impeller, bronze, MBP 3 HP','PUMP','Hydraulics','NOS',820,90,0,'In-house foundry',8,10,'Make');
m('P-IMP-OW','Impeller, cast iron, openwell','PUMP','Hydraulics','NOS',650,100,0,'In-house foundry',8,10,'Make');
m('P-IMP-SS4','Impeller stage, SS, V4','PUMP','Hydraulics','NOS',210,1800,1000,'Precision Pressings',14,500);
m('P-DIF-SS4','Diffuser stage, SS, V4','PUMP','Hydraulics','NOS',190,2400,1000,'Precision Pressings',14,500);
m('P-CAS-MB5','Pump casing, cast iron, MBP 5 HP','PUMP','Casing','NOS',1450,50,50,'Coimbatore Castings',20,10);
m('P-CAS-MB3','Pump casing, cast iron, MBP 3 HP','PUMP','Casing','NOS',1150,160,0,'Coimbatore Castings',20,10);
m('P-CAS-OW','Pump casing, openwell','PUMP','Casing','NOS',1100,40,0,'Coimbatore Castings',20,10);
m('P-PSH-V4','Pump shell, SS304, V4','PUMP','Casing','NOS',720,320,0,'Steelform Fabricators',18,25);
m('P-MSL-20','Mechanical seal, 20 mm','PUMP','Sealing','NOS',340,150,200,'SealTech India',12,50);
m('P-WRG-01','Wear ring, bronze','PUMP','Sealing','NOS',60,300,0,'In-house foundry',8,50,'Make');
m('P-GKT-01','Gasket set, gasket & O-ring','PUMP','Sealing','SET',35,900,0,'SealTech India',7,200);
m('P-FLG-50','Flange, 50 mm, suction/delivery','PUMP','Connections','NOS',140,500,0,'Coimbatore Castings',20,50);
m('P-NRV-V4','NRV housing, V4','PUMP','Connections','NOS',380,80,200,'Precision Pressings',14,100);
m('P-SUC-V4','Suction interconnector, V4','PUMP','Connections','NOS',290,360,0,'Precision Pressings',14,100);
m('E-STR-DOL','DOL starter, 5 HP, 3-phase','PANEL','Switchgear','NOS',2400,40,60,'Shakti Switchgear',10,10);
m('E-STR-1PH','Single-phase starter, with capacitor box','PANEL','Switchgear','NOS',1650,170,0,'Shakti Switchgear',10,10);
m('E-CTB-1PH','Control box, 1-phase submersible','PANEL','Switchgear','NOS',1850,120,100,'Shakti Switchgear',10,25);
m('E-CON-25','Contactor, 25 A','PANEL','Switchgear','NOS',1150,60,0,'Shakti Switchgear',10,10);
m('E-OLR-10','Overload relay, 7–10 A','PANEL','Switchgear','NOS',780,55,0,'Shakti Switchgear',10,10);
m('E-MCB-32','MCB 32 A, TP','PANEL','Switchgear','NOS',650,260,0,'Elmex Electricals',7,20);
m('E-MCB-16','MCB 16 A, DP','PANEL','Switchgear','NOS',420,200,0,'Elmex Electricals',7,20);
m('E-ENC-01','Panel enclosure, MS powder coated','PANEL','Enclosure','NOS',1350,300,0,'Steelform Fabricators',15,25);
m('E-VMT-01','Voltmeter, digital','PANEL','Metering','NOS',320,320,0,'Elmex Electricals',7,50);
m('E-AMT-01','Ammeter, digital','PANEL','Metering','NOS',320,300,0,'Elmex Electricals',7,50);
m('E-LMP-01','Indicator lamp set, R/Y/B','PANEL','Metering','SET',120,150,0,'Elmex Electricals',7,50);
m('E-CBL-4','Cable 4 sq.mm, 3-core','PANEL','Cabling','MTR',165,1500,0,'Cable House Traders',5,500);
m('E-CBL-25','Cable 2.5 sq.mm, 3-core','PANEL','Cabling','MTR',110,900,0,'Cable House Traders',5,500);
m('E-FLC-25','Flat cable 2.5 sq.mm, submersible','PANEL','Cabling','MTR',95,4000,2000,'Cable House Traders',5,1000);
m('H-FST-01','Fastener kit (bolts, nuts, washers)','PACK','Hardware','SET',75,600,0,'Fastners Corner',4,200);
m('H-NPL-01','Name plate, SS etched','PACK','Hardware','NOS',25,900,0,'Fastners Corner',4,500);
m('H-BOX-L','Corrugated box, 5-ply, large','PACK','Packing','NOS',140,320,200,'Box & Pack Industries',6,200);
m('H-MAN-01','Manual & warranty card, printed','PACK','Packing','NOS',8,2000,0,'Box & Pack Industries',6,1000);

// Item = short name (text before the first comma), spec = the rest. Replace with real fields from your item master.
Object.values(MAT).forEach(x=>{ const i=x.desc.indexOf(','); x.item=i<0?x.desc:x.desc.slice(0,i).trim(); x.spec=i<0?'':x.desc.slice(i+1).trim(); });

const PACKING = [['H-FST-01',1],['H-NPL-01',1],['H-BOX-L',1],['H-MAN-01',1]];
const PRODUCTS = [
  {code:'MBP-5HP-3PH', vendor:'Tesla Pumps', motor:'140CL Dsp', pump:'30 Stage R2', panel:'VBMR-DELTA', name:'Monoblock Pump 5 HP, 3-Phase', fam:'Monoblock', cat:'Monoblock Heavy Duty', hp:5, ph:'3Φ 415 V', spec:'Head 32 m · Flow 600 LPM · 65×50 mm', rev:'R3',
   bom:[['M-STP-150',1],['M-CUW-22',4.2],['M-INS-01',1],['M-ROT-150',1],['M-SFT-28',1],['M-BRG-6306',1],['M-BRG-6205',1],['M-BDY-01',1],['M-ESH-01',2],['M-FAN-01',1],['M-FCV-01',1],['M-TBX-01',1],
        ['P-IMP-MB5',1],['P-CAS-MB5',1],['P-MSL-20',1],['P-WRG-01',1],['P-GKT-01',1],['P-FLG-50',2],
        ['E-STR-DOL',1],['E-MCB-32',1],['E-ENC-01',1],['E-VMT-01',1],['E-AMT-01',1],['E-LMP-01',1],['E-CBL-4',3],...PACKING]},
  {code:'MBP-3HP-1PH', vendor:'Tesla Pumps', motor:'100CL Csr', pump:'MB-3 Single R1', panel:'VBMR-SP16', name:'Monoblock Pump 3 HP, 1-Phase', fam:'Monoblock', cat:'Monoblock Domestic', hp:3, ph:'1Φ 230 V', spec:'Head 28 m · Flow 400 LPM · 50×50 mm', rev:'R5',
   bom:[['M-STP-100',1],['M-CUW-24',2.8],['M-INS-01',1],['M-ROT-100',1],['M-SFT-24',1],['M-BRG-6204',1],['M-BRG-6205',1],['M-BDY-01',1],['M-ESH-01',2],['M-FAN-01',1],['M-FCV-01',1],['M-TBX-01',1],['M-CAP-36',1],
        ['P-IMP-MB3',1],['P-CAS-MB3',1],['P-MSL-20',1],['P-WRG-01',1],['P-GKT-01',1],['P-FLG-50',2],
        ['E-STR-1PH',1],['E-MCB-16',1],['E-ENC-01',1],['E-VMT-01',1],['E-AMT-01',1],['E-CBL-25',3],...PACKING]},
  {code:'SUB-V4-1HP-1PH', vendor:'Aqua Drive Motors', motor:'V4-1H Oil Fill', pump:'12 Stage R2', panel:'CB-1PH-SD', name:'V4 Submersible 1 HP, 1-Phase, 12 stage', fam:'Submersible', cat:'V4 Jumbo Design', hp:1, ph:'1Φ 230 V', spec:'Head 90 m · Flow 60 LPM · 100 mm bore', rev:'R2',
   bom:[['M-STP-V4',1],['M-CUW-PVC',1.6],['M-ROT-V4',1],['M-SFT-V4',1],['M-BRG-THR',1],['M-BDY-V4',1],['M-CAP-36',1],
        ['P-IMP-SS4',12],['P-DIF-SS4',12],['P-PSH-V4',1],['P-NRV-V4',1],['P-SUC-V4',1],['P-GKT-01',1],
        ['E-CTB-1PH',1],['E-FLC-25',20],...PACKING]},
  {code:'OWP-2HP-3PH', vendor:'Nova Pumps', motor:'100CL Dsp', pump:'OW Single R1', panel:'VBMR-DOL', name:'Openwell Submersible 2 HP, 3-Phase', fam:'Openwell', cat:'Openwell Horizontal', hp:2, ph:'3Φ 415 V', spec:'Head 24 m · Flow 350 LPM · 50 mm', rev:'R1',
   bom:[['M-STP-100',1],['M-CUW-PVC',2.2],['M-INS-01',1],['M-ROT-100',1],['M-SFT-24',1],['M-BRG-6204',2],['M-BDY-01',1],['M-ESH-01',2],
        ['P-IMP-OW',1],['P-CAS-OW',1],['P-MSL-20',1],['P-GKT-01',1],['P-FLG-50',1],
        ['E-CON-25',1],['E-OLR-10',1],['E-MCB-32',1],['E-ENC-01',1],['E-LMP-01',1],['E-CBL-4',10],...PACKING]},
];
const PLANS = {
  '2026-12':{'MBP-5HP-3PH':120,'MBP-3HP-1PH':150,'SUB-V4-1HP-1PH':300,'OWP-2HP-3PH':80},
  '2027-01':{'MBP-5HP-3PH':140,'MBP-3HP-1PH':160,'SUB-V4-1HP-1PH':350,'OWP-2HP-3PH':60},
  '2027-02':{'MBP-5HP-3PH':100,'MBP-3HP-1PH':180,'SUB-V4-1HP-1PH':400,'OWP-2HP-3PH':90},
};
const TODAY = new Date('2026-11-11');
