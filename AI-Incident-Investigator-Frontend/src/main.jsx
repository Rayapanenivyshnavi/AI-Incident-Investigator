import React, {useState} from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard, TriangleAlert, Search, FileText, Activity,
  History, Wrench, ShieldCheck, ClipboardList, Bell, ChevronRight,
  CircleCheck, CircleAlert, Clock3, Database, BrainCircuit,
  ArrowUpRight, RefreshCw, Play, Check, X, Menu
} from "lucide-react";
import "./styles.css";

const incidents = [
  {id:"INC-1048", service:"payment-service", type:"database_failure", severity:"Critical", status:"Investigating", time:"2 min ago", latency:"1,842 ms", errors:"38"},
  {id:"INC-1047", service:"order-service", type:"high_latency", severity:"High", status:"RCA Ready", time:"18 min ago", latency:"1,124 ms", errors:"17"},
  {id:"INC-1046", service:"auth-service", type:"service_error", severity:"Medium", status:"Resolved", time:"42 min ago", latency:"486 ms", errors:"9"},
  {id:"INC-1045", service:"catalog-service", type:"cpu_pressure", severity:"High", status:"Resolved", time:"1 hr ago", latency:"732 ms", errors:"12"},
  {id:"INC-1044", service:"search-service", type:"slow_database_query", severity:"Medium", status:"Resolved", time:"2 hr ago", latency:"645 ms", errors:"7"}
];

const historical = [
  {id:"HIST-221", title:"Database connection exhaustion", similarity:"94%", root:"Connection pool exhausted", outcome:"Recovered"},
  {id:"HIST-187", title:"Slow query causing checkout latency", similarity:"89%", root:"Unindexed database query", outcome:"Recovered"},
  {id:"HIST-154", title:"Payment service DB outage", similarity:"84%", root:"Database unavailable", outcome:"Recovered"}
];

const logs = [
  ["18:41:02","ERROR","payment-service","Database connection refused"],
  ["18:41:04","WARN","payment-service","Retry attempt 2/3"],
  ["18:41:06","ERROR","payment-service","Connection pool exhausted"],
  ["18:41:08","ERROR","gateway","Upstream timeout from payment-service"],
  ["18:41:12","INFO","incident-detector","Incident INC-1048 created"]
];

function App(){
  const [page,setPage]=useState("Dashboard");
  const [selected,setSelected]=useState(incidents[0]);
  const [mobile,setMobile]=useState(false);

  const navigate = p => { setPage(p); setMobile(false); };

  return <div className="app">
    <aside className={"sidebar "+(mobile?"open":"")}>
      <div className="brand">
        <div className="brandIcon"><BrainCircuit size={24}/></div>
        <div><b>Incident AI</b><span>Production Investigator</span></div>
      </div>

      <div className="navLabel">MONITORING</div>
      <Nav icon={<LayoutDashboard/>} text="Dashboard" active={page==="Dashboard"} onClick={()=>navigate("Dashboard")}/>
      <Nav icon={<TriangleAlert/>} text="Incidents" active={page==="Incidents"} badge="5" onClick={()=>navigate("Incidents")}/>
      <Nav icon={<FileText/>} text="Logs & Events" active={page==="Logs & Events"} onClick={()=>navigate("Logs & Events")}/>
      <Nav icon={<Activity/>} text="Metrics" active={page==="Metrics"} onClick={()=>navigate("Metrics")}/>

      <div className="navLabel">INVESTIGATION</div>
      <Nav icon={<Search/>} text="Investigation" active={page==="Investigation"} onClick={()=>navigate("Investigation")}/>
      <Nav icon={<History/>} text="Historical Cases" active={page==="Historical Cases"} onClick={()=>navigate("Historical Cases")}/>
      <Nav icon={<Wrench/>} text="Remediation" active={page==="Remediation"} onClick={()=>navigate("Remediation")}/>
      <Nav icon={<ShieldCheck/>} text="Verification" active={page==="Verification"} onClick={()=>navigate("Verification")}/>
      <Nav icon={<ClipboardList/>} text="Reports" active={page==="Reports"} onClick={()=>navigate("Reports")}/>

      <div className="sidebarBottom">
        <div className="system"><span className="dot"></span><div><b>System Online</b><small>All services connected</small></div></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobileBtn" onClick={()=>setMobile(!mobile)}><Menu/></button>
        <div><div className="crumb">Production Operations</div><h1>{page}</h1></div>
        <div className="topActions">
          <div className="env"><span className="dot"></span>Production</div>
          <button className="iconBtn"><Bell size={19}/><i></i></button>
          <div className="avatar">RV</div>
        </div>
      </header>

      {page==="Dashboard" && <Dashboard navigate={navigate} setSelected={setSelected}/>}
      {page==="Incidents" && <Incidents navigate={navigate} setSelected={setSelected}/>}
      {page==="Investigation" && <Investigation incident={selected} navigate={navigate}/>}
      {page==="Logs & Events" && <Logs/>}
      {page==="Metrics" && <Metrics/>}
      {page==="Historical Cases" && <Historical/>}
      {page==="Remediation" && <Remediation navigate={navigate}/>}
      {page==="Verification" && <Verification/>}
      {page==="Reports" && <Reports/>}
    </main>
  </div>
}

function Nav({icon,text,active,onClick,badge}) {
 return <button className={"navItem "+(active?"active":"")} onClick={onClick}>{icon}<span>{text}</span>{badge&&<em>{badge}</em>}</button>
}

function Dashboard({navigate,setSelected}) {
 return <div className="content">
   <section className="hero">
     <div><div className="eyebrow">AI OPERATIONS CENTER</div><h2>Production incident intelligence</h2><p>Detect, investigate, explain and safely resolve production incidents with evidence-backed analysis.</p></div>
     <button className="primary" onClick={()=>navigate("Incidents")}><Search size={17}/> Investigate incident</button>
   </section>

   <div className="stats">
     <Stat icon={<TriangleAlert/>} label="Active incidents" value="2" sub="1 critical" tone="danger"/>
     <Stat icon={<Search/>} label="Investigations" value="7" sub="3 in progress"/>
     <Stat icon={<CircleCheck/>} label="Recovered today" value="18" sub="+12% vs yesterday" tone="good"/>
     <Stat icon={<Clock3/>} label="Avg. recovery" value="8m 42s" sub="-16% this week" tone="blue"/>
   </div>

   <div className="grid2">
     <Panel title="Active incidents" action="View all" onAction={()=>navigate("Incidents")}>
       <div className="incidentRows">{incidents.slice(0,3).map(i=><IncidentRow key={i.id} i={i} onClick={()=>{setSelected(i);navigate("Investigation")}}/>)}</div>
     </Panel>
     <Panel title="Investigation pipeline">
       <Pipeline/>
     </Panel>
   </div>

   <div className="grid2">
     <Panel title="Evidence overview">
       <div className="evidenceGrid">
         <Evidence label="Logs analyzed" value="12,482" icon={<FileText/>}/>
         <Evidence label="Metrics checked" value="36" icon={<Activity/>}/>
         <Evidence label="Historical matches" value="3" icon={<History/>}/>
         <Evidence label="RCA confidence" value="92%" icon={<BrainCircuit/>}/>
       </div>
     </Panel>
     <Panel title="Recovery status">
       <div className="recovery">
         <div className="ring"><b>94%</b><span>health</span></div>
         <div><b>System recovering normally</b><p>All monitored services are within verification thresholds.</p><span className="tag good">Verification passed</span></div>
       </div>
     </Panel>
   </div>
 </div>
}

function Incidents({navigate,setSelected}) {
 return <div className="content">
   <div className="pageIntro"><div><p className="muted">Detected production anomalies and investigations</p></div><button className="primary"><RefreshCw size={16}/> Refresh</button></div>
   <Panel>
     <div className="tableTools"><div className="search"><Search size={17}/><input placeholder="Search incidents..." /></div><select><option>All severities</option><option>Critical</option><option>High</option><option>Medium</option></select></div>
     <table><thead><tr><th>Incident</th><th>Service</th><th>Type</th><th>Severity</th><th>Status</th><th>Detected</th><th></th></tr></thead>
     <tbody>{incidents.map(i=><tr key={i.id}><td><b>{i.id}</b></td><td>{i.service}</td><td className="mono">{i.type}</td><td><Severity s={i.severity}/></td><td><span className="status">{i.status}</span></td><td>{i.time}</td><td><button className="linkBtn" onClick={()=>{setSelected(i);navigate("Investigation")}}>Investigate <ChevronRight size={14}/></button></td></tr>)}</tbody></table>
   </Panel>
 </div>
}

function Investigation({incident,navigate}) {
 return <div className="content">
   <div className="incidentHeader">
     <div><span className="tag danger">{incident.severity}</span><h2>{incident.id} · {incident.type}</h2><p>{incident.service} · detected {incident.time}</p></div>
     <button className="primary" onClick={()=>navigate("Remediation")}><Wrench size={16}/> Open remediation</button>
   </div>

   <div className="pipelineCard">
     <div className="step done"><span>1</span><b>Detection</b><small>Confirmed</small></div><div className="line done"></div>
     <div className="step done"><span>2</span><b>Retrieval</b><small>3 matches</small></div><div className="line done"></div>
     <div className="step current"><span>3</span><b>RCA</b><small>92% confidence</small></div><div className="line"></div>
     <div className="step"><span>4</span><b>Remediation</b><small>Pending approval</small></div><div className="line"></div>
     <div className="step"><span>5</span><b>Verification</b><small>Waiting</small></div>
   </div>

   <div className="grid2">
     <Panel title="Root cause analysis" subtitle="Evidence-weighted explanation">
       <div className="rcaBox"><div className="confidence"><span>Confidence</span><b>92%</b></div><h3>Database connection pool exhausted</h3><p>Current evidence indicates repeated database connection failures followed by pool exhaustion and upstream request timeouts.</p>
       <div className="reason"><CircleCheck size={17}/><span><b>Strong evidence:</b> connection-refused errors appeared before the latency spike.</span></div>
       <div className="reason"><CircleCheck size={17}/><span><b>Historical support:</b> similar incidents recovered after connection-pool remediation.</span></div></div>
     </Panel>
     <Panel title="Current evidence">
       <div className="evidenceList">{logs.map((l,n)=><div className="evidenceItem" key={n}><span className="time">{l[0]}</span><span className={"level "+l[1].toLowerCase()}>{l[1]}</span><div><b>{l[2]}</b><p>{l[3]}</p></div></div>)}</div>
     </Panel>
   </div>
   <Panel title="Adaptive historical retrieval" subtitle="Similarity-based matches above relevance threshold">
     <div className="historyCards">{historical.map(h=><div className="historyCard" key={h.id}><div className="match">{h.similarity}</div><div><b>{h.id} · {h.title}</b><p>Root cause: {h.root}</p><span className="tag good">{h.outcome}</span></div><ArrowUpRight size={17}/></div>)}</div>
   </Panel>
 </div>
}

function Logs(){
 return <div className="content"><Panel title="Logs & Events" subtitle="Structured production events"><div className="tableTools"><div className="search"><Search size={17}/><input placeholder="Search log messages..." /></div><span className="tag neutral">12,482 events</span></div><table><thead><tr><th>Timestamp</th><th>Level</th><th>Service</th><th>Message</th></tr></thead><tbody>{logs.concat(logs).map((l,i)=><tr key={i}><td className="mono">{l[0]}</td><td><span className={"level "+l[1].toLowerCase()}>{l[1]}</span></td><td>{l[2]}</td><td>{l[3]}</td></tr>)}</tbody></table></Panel></div>
}

function Metrics(){
 const bars=[38,45,42,61,74,69,83,78,92,88,73,68,54,61,47,52,43,48,39,42];
 return <div className="content"><div className="stats"><Stat icon={<Activity/>} label="Requests / min" value="1,842" sub="Normal range 1.2k–2.1k"/><Stat icon={<TriangleAlert/>} label="Error rate" value="3.8%" sub="Threshold 1.0%" tone="danger"/><Stat icon={<Clock3/>} label="P95 latency" value="1.84s" sub="Threshold 900ms" tone="danger"/><Stat icon={<Database/>} label="DB connections" value="98%" sub="Pool capacity" tone="danger"/></div><Panel title="Service latency trend" subtitle="Recent production window"><div className="chart">{bars.map((h,i)=><div key={i} className={"bar "+(h>80?"hot":"")} style={{height:(h*2.2)+"px"}}></div>)}</div><div className="chartLabels"><span>20 min ago</span><span>Now</span></div></Panel><div className="grid2"><Panel title="Error rate"><div className="bigMetric">3.8% <span>above threshold</span></div></Panel><Panel title="Resource pressure"><div className="bigMetric">82% <span>CPU utilization</span></div></Panel></div></div>
}

function Historical(){
 return <div className="content"><div className="pageIntro"><div><p className="muted">Historical incident repository and adaptive retrieval</p></div><span className="tag neutral">1,248 cases indexed</span></div><Panel title="Retrieved historical cases"><div className="historyCards">{historical.concat([{id:"HIST-098",title:"Gateway timeout after DB pressure",similarity:"78%",root:"Database resource pressure",outcome:"Recovered"}]).map(h=><div className="historyCard" key={h.id}><div className="match">{h.similarity}</div><div><b>{h.id} · {h.title}</b><p>Root cause: {h.root}</p><span className="tag good">{h.outcome}</span></div><button className="linkBtn">View <ChevronRight size={14}/></button></div>)}</div></Panel></div>
}

function Remediation({navigate}){
 const [approved,setApproved]=useState(false);
 return <div className="content"><div className="incidentHeader"><div><span className="tag warning">Approval required</span><h2>Controlled remediation plan</h2><p>Only allowlisted actions can be executed.</p></div></div><div className="grid2"><Panel title="Recommended action" subtitle="Generated from RCA evidence"><div className="actionBox"><div className="actionIcon"><Wrench/></div><div><h3>Recycle database connection pool</h3><p>Restart the affected connection pool and re-check application health.</p><span className="tag neutral">ALLOWLISTED ACTION</span></div></div><div className="approval"><label><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/> I approve this remediation action.</label><button className="primary" disabled={!approved} onClick={()=>navigate("Verification")}><Play size={16}/> Execute approved action</button></div></Panel><Panel title="Safety policy"><div className="policy"><CircleCheck/> <div><b>Controlled execution</b><p>Actions are restricted to the approved remediation list.</p></div></div><div className="policy"><ShieldCheck/> <div><b>Recovery verification</b><p>Health, error and latency checks run after execution.</p></div></div></Panel></div></div>
}

function Verification(){
 return <div className="content"><div className="verifyHero"><div className="checkCircle"><CircleCheck size={42}/></div><div><span className="tag good">VERIFICATION PASSED</span><h2>Service recovery confirmed</h2><p>Post-remediation checks are within the defined recovery thresholds.</p></div></div><div className="stats"><Stat icon={<CircleCheck/>} label="Health check" value="PASS" sub="All services healthy" tone="good"/><Stat icon={<Activity/>} label="Error rate" value="0.4%" sub="Below 1.0% threshold" tone="good"/><Stat icon={<Clock3/>} label="P95 latency" value="612 ms" sub="Below 900ms threshold" tone="good"/><Stat icon={<Database/>} label="DB pool" value="42%" sub="Capacity restored" tone="good"/></div><Panel title="Closed-loop result"><div className="resultLine"><span className="stepDone">1</span><b>Incident detected</b><ChevronRight/><span className="stepDone">2</span><b>RCA completed</b><ChevronRight/><span className="stepDone">3</span><b>Remediation approved</b><ChevronRight/><span className="stepDone">4</span><b>Recovery verified</b></div></Panel></div>
}

function Reports(){
 return <div className="content"><Panel title="Incident report" subtitle="Generated investigation record"><div className="report"><div className="reportHead"><div><span className="tag good">CLOSED</span><h2>INC-1048 · Database connection failure</h2><p>Production · payment-service · 18:41–18:50</p></div><button className="secondary">Export report</button></div><div className="reportGrid"><div><small>ROOT CAUSE</small><b>Connection pool exhaustion</b></div><div><small>RCA CONFIDENCE</small><b>92%</b></div><div><small>RETRIEVED CASES</small><b>3</b></div><div><small>RECOVERY</small><b>8m 42s</b></div></div><hr/><h3>Evidence summary</h3><p>Investigation correlated structured logs, latency metrics and historical incidents. The evidence supported database connection pool exhaustion as the primary cause.</p><h3>Remediation</h3><p>Approved allowlisted connection-pool recovery action was executed, followed by health, error-rate and latency verification.</p></div></Panel></div>
}

function Pipeline(){return <div className="pipelineMini">{["Detection","Historical retrieval","Root cause analysis","Resolution planning","Recovery verification"].map((x,i)=><div key={x} className={i<3?"done":""}><span>{i<3?"✓":i+1}</span><b>{x}</b><small>{i<3?"Completed":i===3?"Pending approval":"Waiting"}</small></div>)}</div>}
function Stat({icon,label,value,sub,tone=""}){return <div className={"stat "+tone}><div className="statIcon">{icon}</div><div><span>{label}</span><b>{value}</b><small>{sub}</small></div></div>}
function Panel({title,subtitle,children,action,onAction}){return <section className="panel"><div className="panelHead"><div>{title&&<h3>{title}</h3>}{subtitle&&<p>{subtitle}</p>}</div>{action&&<button className="linkBtn" onClick={onAction}>{action} <ChevronRight size={14}/></button>}</div>{children}</section>}
function IncidentRow({i,onClick}){return <button className="incidentRow" onClick={onClick}><div className={"sevDot "+i.severity.toLowerCase()}></div><div className="rowMain"><b>{i.id} · {i.service}</b><span>{i.type}</span></div><Severity s={i.severity}/><span className="status">{i.status}</span><ChevronRight size={17}/></button>}
function Severity({s}){return <span className={"severity "+s.toLowerCase()}><span></span>{s}</span>}
function Evidence({label,value,icon}){return <div className="evidence"><div>{icon}</div><span>{label}</span><b>{value}</b></div>}

createRoot(document.getElementById("root")).render(<App />);
