/* ══════════════════════════════════════════
   DEFAULT DATA
   ══════════════════════════════════════════ */
const DEFAULT_SECTIONS = [
  { num:'1',  title:'What is a Visual Lead?',                description:'An overview of the Visual Lead role — its mission, core pillars, and place within Mega Cat Studios.' },
  { num:'2',  title:'Role Structure & Authority',            description:'How the VL relates to the Art Director, what decisions VLs own independently, and when to escalate.' },
  { num:'3',  title:'Core Responsibilities',                 description:'The full scope of VL work: vision-setting, art team leadership, production collaboration, and technical alignment.' },
  { num:'4',  title:'Task Frequency Reference',              description:'A quick-reference table showing how often each core VL task recurs — always, daily, weekly, or per milestone.' },
  { num:'5',  title:'Project Phase Responsibilities',        description:'What VLs are responsible for at each project phase: pitching, pre-production, production, and post-production.' },
  { num:'6',  title:'Onboarding to a New Project',           description:'How to set yourself up for success when joining a project — whether at kick-off or mid-production.' },
  { num:'7',  title:'Art Bible Standards',                   description:'What an Art Bible contains, how to maintain it, and how to give consistent, direction-based feedback on art assets.' },
  { num:'8',  title:'Defending Direction & Handling Feedback', description:'How to build a defensible case for a visual direction, respond to pushback, and recognize when a change is warranted.' },
  { num:'9',  title:'Direction Changes Mid-Production',      description:'The formal process for identifying, evaluating, and implementing a directional change without disrupting the team.' },
  { num:'10', title:'Communication Standards',               description:'Check-in cadence, when to call vs. use async, and how to keep communication clear across distributed teams.' },
  { num:'11', title:'Pipelines & Workflows',                 description:'How production plans, goalsets, asset reviews, and build reviews are structured and executed.' },
  { num:'12', title:'Goal Setting & Task Management',        description:'Using the SMART framework for task delegation and the Pulse Sheet system for personal task tracking.' },
  { num:'13', title:'Meetings & Reporting',                  description:'The standing weekly format, postmortem structure, and how reporting flows from the VL level upward.' },
  { num:'14', title:'Art Standards Reference',               description:'Evaluation criteria for each visual discipline: Character, Environment, UI, VFX, Cinematography, and Animation.' },
  { num:'15', title:'KPI & Performance',                     description:'The four KPI categories used in quarterly performance reviews for Visual Leads.' },
  { num:'16', title:'Resources & Tools',                     description:'Department document links and the core tools used day-to-day: Gyazo, OBS, Google Sheets, Figma, Draw.io.' }
];

const DEFAULT_HANDBOOK = [
  { id:"1.1", section:"1. What is a Visual Lead?", title:"The Mission",
    keywords:["visual lead","what is","mission","role","overview","definition","vl","purpose"],
    content:`A Visual Lead (VL) helps guide and maintain the visual direction of a project from concept through final implementation. The role focuses on ensuring that the game's artistic identity remains clear, cohesive, and aligned across all visual elements and pipelines involved in development.<br><br>VLs work closely with artists, production, design, and other departments to help translate creative goals into a consistent player experience. They are expected to remain open to collaboration, iteration, and production realities as projects evolve.`
  },
  { id:"1.2", section:"1. What is a Visual Lead?", title:"The Five Pillars of the Role",
    keywords:["pillars","responsibilities overview","what does vl do","vl duties","five pillars"],
    content:`<ul><li>Helping define and maintain the project's visual direction and artistic standards</li><li>Collaborating with Production, Design, and other departments to align creative and production goals</li><li>Setting visual goals, references, and expectations for art deliverables</li><li>Reviewing assets and providing constructive feedback to maintain consistency and quality</li><li>Supporting the team through communication, problem-solving, and occasional hands-on contribution</li><li>Representing and communicating the project's visual direction across teams and discussions</li></ul>`
  },
  { id:"2.1", section:"2. Role Structure & Authority", title:"Visual Lead and Art Director Relationship",
    keywords:["art director","ad","relationship","vl vs ad","escalation","oversight","hierarchy","authority"],
    content:`Visual Leads guide the visual direction of their assigned projects day-to-day. The Art Director (AD) provides broader oversight across projects and ensures alignment with studio-wide standards.<br><br>The relationship is <strong>collaborative, not approval-driven</strong>. Not every decision requires AD escalation — VLs are expected to exercise ownership and communicate proactively when additional alignment is needed.`
  },
  { id:"2.2", section:"2. Role Structure & Authority", title:"Decision Authority",
    keywords:["decision","authority","who decides","escalate","sign off","ownership","approval","vl owns"],
    content:`<table><tr><th>Decision Type</th><th>VL Owns</th><th>Escalates to AD</th></tr><tr><td>Asset feedback and approval</td><td>Primary reviewer and approver</td><td>Not typically required</td></tr><tr><td>Art bible creation and updates</td><td>Leads creation and maintenance</td><td>Consulted for major directional changes</td></tr><tr><td>Handling pushback on visual direction</td><td>Leads discussions within project scope</td><td>Available for support when needed</td></tr><tr><td>Directional changes during production</td><td>Collaborates on adjustments</td><td>Kept informed on significant changes</td></tr><tr><td>Large scope or pipeline risks</td><td>Identifies concerns, raises them proactively</td><td>Included in resolution planning</td></tr><tr><td>Cross-project pipeline changes</td><td>May propose improvements</td><td>Exec Producer reviews</td></tr></table>`
  },
  { id:"3.1", section:"3. Core Responsibilities", title:"Vision and Direction",
    keywords:["vision","direction","art direction bible","creative pillars","color","lighting","benchmarks","visual identity"],
    content:`<ul><li>Collaborating with Producers and project leadership during pre-production to define the game's visual identity</li><li>Developing and maintaining the Art Direction Bible and related visual reference materials</li><li>Establishing creative pillars and visual guidelines that support consistent artistic decision-making</li><li>Guiding lighting, color, composition, mood, and overall presentation</li><li>Researching comparable titles or references to inform visual direction and production goals</li><li>Setting and communicating clear visual benchmarks and expectations before and during production</li></ul>`
  },
  { id:"3.2", section:"3. Core Responsibilities", title:"Art Team Leadership",
    keywords:["art team","leadership","mentoring","feedback","artists","subteams","2d","3d","ui","vfx","concept art"],
    content:`<ul><li>Supporting and coordinating with art subteams: UI, VFX, 2D, 3D, and Concept Art</li><li>Guiding artists on visual tone, atmosphere, environments, characters, and key presentation moments</li><li>Providing constructive, actionable, and consistent feedback on assets and deliverables</li><li>Mentoring and supporting artists in direction, workflow, and artistic development</li><li>Identifying workflow or direction-related challenges early and helping coordinate solutions</li></ul>`
  },
  { id:"3.3", section:"3. Core Responsibilities", title:"Production Collaboration & Role Alignment",
    keywords:["producer","production","collaboration","producer vs vl","vl vs producer","difference","role alignment","art producer","who owns","responsibilities split","collaborating with producers"],
    content:`<strong>Visual Lead responsibilities:</strong><ul><li>Defining visual goals and milestone expectations</li><li>Preparing asset request lists with references, specifications, and creative context</li><li>Reviewing and approving visual requests before implementation or production</li><li>Communicating artistic priorities, concerns, and project goals to Production and the Art Team</li><li>Raising concerns when timelines or production decisions may negatively affect visual quality</li></ul><strong>Production / Art Producer responsibilities:</strong><ul><li>Managing production schedules, tracking, and coordination</li><li>Providing ETAs, feasibility checks, and scope assessments</li><li>Monitoring blockers, delivery progress, and production risks</li><li>Supporting manpower allocation and workflow planning</li></ul><em>Note: Both roles are expected to collaborate closely and support one another.</em>`
  },
  { id:"3.4", section:"3. Core Responsibilities", title:"Creative-Technical Alignment",
    keywords:["technical","engineering","tech art","feasibility","performance","engine constraints","build review","playtesting","technical limitations"],
    content:`<ul><li>Collaborating with Engineering and Tech Art teams to assess feasibility before major directions are finalized</li><li>Balancing artistic ambition with engine constraints, performance considerations, and production realities</li><li>Participating in build reviews and playtesting to evaluate visual clarity and player experience</li><li>Communicating technical limitations and implementation considerations clearly to the art team</li></ul>`
  },
  { id:"4", section:"4. Task Frequency Reference", title:"How Often Each Core Task Occurs",
    keywords:["frequency","how often","daily","weekly","monthly","task list","art bible","moodboard","style guide","review","sprint","kpi"],
    content:`<table><tr><th>Task</th><th>VL</th><th>AD</th></tr><tr><td>Establish art pipelines</td><td>Always</td><td>Review basis</td></tr><tr><td>Unified art bible</td><td>Always</td><td>Always</td></tr><tr><td>Moodboarding and concept documentation</td><td>Always</td><td>Review basis</td></tr><tr><td>Art production plans (all pipelines)</td><td>Always</td><td>Review basis</td></tr><tr><td>Style guides (VFX, 3D, 2D, UI)</td><td>Always</td><td>When needed</td></tr><tr><td>Task delegation to art team</td><td>Daily</td><td>Daily</td></tr><tr><td>Asset reviews (all pipelines)</td><td>Daily</td><td>Occasionally</td></tr><tr><td>Weekly sync</td><td>Weekly</td><td>Weekly</td></tr><tr><td>Project playtesting</td><td>Per milestone</td><td>Per milestone</td></tr><tr><td>KPI evaluations</td><td>Not needed</td><td>Quarterly</td></tr></table>`
  },
  { id:"5.1", section:"5. Project Phase Responsibilities", title:"Pitching Phase",
    keywords:["pitch","pitching","early","initial","concept","pre-production start","art direction start"],
    content:`During the pitching phase, Visual Leads help establish the project's early visual identity and creative direction:<ul><li>Defining the project's initial art direction and creative pillars</li><li>Preparing early concept documentation: style guides, environment references, character direction, visual mood references</li><li>Assisting in the creation of an early Art Direction Bible or equivalent reference material</li><li>Creating visual mockups, compositions, and presentation materials</li><li>Conducting reference research and comparative visual studies to support the pitch direction</li></ul>`
  },
  { id:"5.2", section:"5. Project Phase Responsibilities", title:"Pre-Production Phase",
    keywords:["pre-production","preproduction","before production","planning phase","milestone expectations","asset request","pipeline"],
    content:`During pre-production, the VL refines, organizes, and validates the project's visual direction before full production begins:<ul><li>Updating and refining the Art Direction Bible and related visual documentation</li><li>Defining visual goals, quality targets, and milestone expectations for production</li><li>Preparing initial asset request lists with references, specifications, and implementation notes</li><li>Collaborating with stakeholders to review mockups, prototypes, and early visual test cases</li><li>Coordinating with Production and other departments to establish workflows and pipeline expectations</li></ul><em>Note: Production feasibility assessments and timeline projections are typically handled in collaboration with Production or Art Producers.</em>`
  },
  { id:"5.3", section:"5. Project Phase Responsibilities", title:"Production Phase (Vertical Slice through Beta)",
    keywords:["production","vertical slice","alpha","beta","content lock","mid-production","pre-alpha","ongoing","milestones","build review","PEQA"],
    content:`During production, the VL maintains artistic consistency, supports development workflows, and guides visual execution across milestones:<ul><li>Maintaining and updating visual documentation throughout development</li><li>Providing ongoing feedback on assets, scenes, UI, VFX, environments, and other visual deliverables</li><li>Participating in build reviews and playtesting sessions to evaluate visual quality and player experience</li><li>Submitting review notes, PEQA sheets, or other documentation tied to milestone evaluations</li><li>Coordinating with Engineering and Tech Art teams regarding implementation concerns and pipeline support</li></ul>`
  },
  { id:"5.4", section:"5. Project Phase Responsibilities", title:"Post-Production Phase",
    keywords:["post-production","post production","dlc","launch","polish","post-launch","qa","release"],
    content:`During post-production, the VL continues supporting through polish, feedback review, and content refinement:<ul><li>Reviewing and providing feedback on additional or post-launch content such as DLC, updates, or promotional assets</li><li>Evaluating player testing or focus group feedback related to visual presentation and usability</li><li>Coordinating with QA and Production on art-related bugs, polish tasks, or presentation issues</li><li>Supporting final visual refinements leading into release or post-launch support</li></ul>`
  },
  { id:"6.1", section:"6. Onboarding to a New Project", title:"Project Onboarding Checklist",
    keywords:["onboarding","new project","checklist","starting","first steps","joining","fresh start","role scope"],
    content:`All six steps must be completed before any directional calls are made to the team:<ol style="margin-left:18px"><li style="margin-bottom:6px"><strong>Confirm Role &amp; Scope</strong> — Clarify assigned projects, art subteams you support, key collaborators, and escalation pathways.</li><li style="margin-bottom:6px"><strong>Gather Relevant Project Documents</strong> — Art Direction Bible, Style Guides, GDDs, previous handoff notes.</li><li style="margin-bottom:6px"><strong>Identify Key Contacts &amp; Team Structure</strong> — Know your Producers, Art Leads, Engineering and Tech Art contacts.</li><li style="margin-bottom:6px"><strong>Review Current Project Status</strong> — Verify the project's current development phase with the team.</li><li style="margin-bottom:6px"><strong>Review Existing Visual Direction</strong> — Understand existing standards, workflows, and identify potential inconsistencies.</li><li style="margin-bottom:6px"><strong>Alignment &amp; Direction Confirmation</strong> — Confirm alignment with project leadership before communicating any directional changes.</li></ol>`
  },
  { id:"6.2", section:"6. Onboarding to a New Project", title:"Joining a Mid-Production Project",
    keywords:["mid-production","joining","week 1","week 2","shadow","audit","new vl","transition","mid production"],
    content:`Move through all four phases before making any directional calls. Resist the urge to direct anything in Week 1.<table><tr><th>Phase</th><th>What to Do</th></tr><tr><td><strong>Week 1: Shadow and Observe</strong></td><td>Join all standups without directing. Read every document. Map the team structure. Do not give feedback on assets yet.</td></tr><tr><td><strong>Week 2: Audit the Direction</strong></td><td>Identify gaps between the bible and what is actually being produced. Flag deviations in a written doc for AD review.</td></tr><tr><td><strong>Week 3: Propose and Align</strong></td><td>Present your direction read to the AD. Agree on what to hold and what to evolve. Update the bible to reflect current ratified direction.</td></tr><tr><td><strong>Week 4: Fully Operational</strong></td><td>Begin giving asset feedback and sign-offs. Run your first art sync as the VL. Confirm sign-off authority is communicated to the full team.</td></tr></table>`
  },
  { id:"7.1", section:"7. Art Bible Standards", title:"Typical Inclusions",
    keywords:["art bible","inclusions","what goes in","bible contents","creative pillars","character design","environment","ui direction","vfx direction","cinematography","animation"],
    content:`The Art Bible commonly includes:<ul><li><strong>Creative Pillars</strong> — Core artistic themes, goals, and guiding principles</li><li><strong>Character Design Direction</strong> — Color palettes, shape language, silhouettes, visual readability</li><li><strong>Environment Design Direction</strong> — Environmental themes, color direction, lighting references, post-processing</li><li><strong>UI Direction</strong> — Layout structures, wireframes, color usage, readability standards, component behavior</li><li><strong>VFX Direction</strong> — Visual themes, readability standards, optimization considerations</li><li><strong>Cinematography Direction</strong> — Framing, composition, camera behavior, shot references</li><li><strong>Animation Direction</strong> — Animation principles, workflow considerations, movement readability</li></ul>`
  },
  { id:"7.2", section:"7. Art Bible Standards", title:"Art Bible Maintenance",
    keywords:["bible maintenance","update art bible","keeping bible current","art bible updates","evolve","revise"],
    content:`The Art Bible is intended to evolve alongside the project. Visual Leads are primarily responsible for:<ul><li>Reviewing and updating outdated references or guidelines when needed</li><li>Communicating significant directional updates to relevant teams</li><li>Collaborating with stakeholders when major visual changes are proposed</li><li>Ensuring that updates and revisions are documented clearly for future reference</li></ul>Feedback or suggestions that differ from the current Art Bible should still be evaluated objectively and discussed constructively when appropriate.`
  },
  { id:"7.3", section:"7. Art Bible Standards", title:"Feedback Standards",
    keywords:["feedback standards","giving feedback","constructive feedback","actionable feedback","art feedback","reviewing assets","revision notes"],
    content:`When providing feedback on art assets or deliverables:<ul><li><strong>Objective &amp; Direction-Based</strong> — Feedback should align with the project's established goals, references, and artistic direction, not personal preference.</li><li><strong>Clear &amp; Actionable</strong> — Help artists understand what needs adjustment and why, with enough clarity to reduce unnecessary back-and-forth.</li><li><strong>Use Clear Terminology</strong> — Use consistent and commonly understood artistic or technical terminology.</li><li><strong>Reference-Supported</strong> — Include visual references, examples, or documentation that help clarify the intended direction.</li></ul>`
  },
  { id:"8.1", section:"8. Defending Direction & Handling Feedback", title:"Building a Case for a Direction",
    keywords:["defending direction","building a case","justify direction","creative decision","direction argument","support direction","present direction"],
    content:`Before presenting or reinforcing a visual direction, consider:<ul><li><strong>Does this align with the project's established creative pillars?</strong> Reference the Art Bible, visual goals, or existing project direction.</li><li><strong>Does this support the intended player experience?</strong> Consider readability, immersion, tone, and usability.</li><li><strong>Is the direction technically and production-wise achievable?</strong> Surface uncertainties early and discuss collaboratively.</li><li><strong>Is the direction aligned with stakeholder or client expectations?</strong> Clarify expectations early to reduce unnecessary revisions.</li></ul><strong>When explaining a direction:</strong> explain the creative goal it supports → provide visual references → clarify the player-facing outcome → acknowledge valid concerns → discuss possible adjustments.`
  },
  { id:"8.2", section:"8. Defending Direction & Handling Feedback", title:"Pushback Management & Sample Responses",
    keywords:["pushback","handling pushback","pushback types","how to respond","client feedback","scope concern","subjective preference","pushback management","handle feedback"],
    content:`<table><tr><th>Pushback Type</th><th>What It Usually Sounds Like</th><th>How to Respond</th></tr><tr><td>Subjective Preference</td><td>"I personally don't like this look."</td><td>Acknowledge respectfully. Evaluate whether the direction still aligns with creative pillars and goals.</td></tr><tr><td>Scope or Feasibility Concern</td><td>"This may take too long to implement."</td><td>Treat as a production/feasibility discussion. Coordinate with Production, Engineering, or relevant stakeholders.</td></tr><tr><td>Stakeholder or Client Feedback</td><td>"The client wants something different."</td><td>Clarify the feedback as specifically as possible. Assess how it aligns with project goals.</td></tr><tr><td>Direction or Consistency Concern</td><td>"This feels off-style" or "This doesn't match the established direction."</td><td>Review concern against the Art Bible and project standards objectively.</td></tr><tr><td>Unclear or General Pressure</td><td>"Can we just change it?"</td><td>Ask clarifying questions to understand the concern. Directional changes need clear goals and context.</td></tr></table>`
  },
  { id:"8.3", section:"8. Defending Direction & Handling Feedback", title:"When Direction Changes May Be Necessary",
    keywords:["when to change direction","direction change","necessary change","pivot","evolve direction","user feedback","playtesting results"],
    content:`Direction changes may become necessary when:<ul><li>New gameplay, technical, or platform requirements emerge</li><li>Playtesting, PEQA reviews, or user feedback reveal issues affecting player experience or clarity</li><li>Production realities significantly impact feasibility or implementation</li><li>Stakeholders identify concerns related to quality, consistency, or project goals</li><li>Additional references or benchmarks suggest opportunities for meaningful improvement</li></ul>`
  },
  { id:"9.1", section:"9. Direction Changes Mid-Production", title:"The Direction Change Process",
    keywords:["direction change process","mid-production change","change process","steps","update bible","document change","direction update"],
    content:`<table><tr><th>Step</th><th>Process</th></tr><tr><td>1. Concern Identified</td><td>A VL, team member, or stakeholder identifies feedback or implementation that may not align with the current documented direction.</td></tr><tr><td>2. Initial Review &amp; Evaluation</td><td>The VL reviews the concern alongside creative pillars, references, production context, and existing documentation.</td></tr><tr><td>3. Collaborative Discussion</td><td>Relevant team members discuss constructively using references, project context, and clear reasoning.</td></tr><tr><td>4. Decision Made</td><td>The team aligns on whether the current direction will remain as-is or if adjustments should be implemented.</td></tr><tr><td>5. Documentation Updates</td><td>If changes are approved, the Art Bible and related documentation are updated and communicated to the appropriate teams.</td></tr></table>`
  },
  { id:"10.1", section:"10. Communication Standards", title:"Team Check-In Cadence",
    keywords:["check-in","checkin","standup","monday","wednesday","friday","weekly cadence","communication cadence","team updates"],
    content:`<table><tr><th>Timing</th><th>What to Ask</th><th>What to Do With the Information</th></tr><tr><td><strong>Start of Week (Monday)</strong></td><td>Weekly goals, priorities, known blockers, planned leave or availability concerns</td><td>Align priorities and identify potential risks or support needs early in the week</td></tr><tr><td><strong>Midweek (Wednesday)</strong></td><td>Progress updates, new tasks, workflow concerns, blockers, or shifting priorities</td><td>Maintain visibility on ongoing work and identify areas needing support</td></tr><tr><td><strong>End of Week (Friday)</strong></td><td>Completed work, pending tasks, blockers encountered, or carry-over items</td><td>Review progress, identify recurring issues, and prepare for the following week</td></tr></table>`
  },
  { id:"10.2", section:"10. Communication Standards", title:"Calls vs. Async Communication",
    keywords:["call vs async","when to call","async","slack","synchronous","asynchronous","meeting","screenshare","timezone"],
    content:`<table><tr><th>Consider a Call When…</th><th>Consider Async When…</th></tr><tr><td>Finalizing milestone goals to delegate across teams</td><td>The agenda does not require live discussion</td></tr><tr><td>The issue is too complex for chat and needs a wider audience</td><td>The issue can be resolved in a couple of minutes</td></tr><tr><td>You need to screenshare for context</td><td>A short video recording covers what a screenshare would</td></tr><tr><td>The issue is escalating and everyone needs to be in the same room</td><td>You are delivering information that does not need a response</td></tr><tr><td>You need to instill confidence or raise morale across a team</td><td>The other person is in a different timezone and it is not urgent</td></tr></table>`
  },
  { id:"11.1", section:"11. Pipelines & Workflows", title:"Production Plans and Goalsets",
    keywords:["production plan","goalset","milestone","visual goalset","asset request list","feasibility check","etas","art producer handoff"],
    content:`<ul><li>VL defines the visual goalset for the milestone: what needs to ship, to what standard, and by when</li><li>VL creates asset request lists with visual specs, references, and requirements</li><li>VL hands the goalset to the art producer and requests ETAs and feasibility checks</li><li>Producer returns with feasibility assessment and agreed target dates</li><li>VL holds the producer accountable to those dates</li><li>VL flags any production decision that is visually infeasible or conflicts with the direction</li></ul>`
  },
  { id:"11.2", section:"11. Pipelines & Workflows", title:"Asset Review and Approval Flow",
    keywords:["asset review","approval flow","sign off","art cat","art team lead","final approval","review checkpoint","asset approval"],
    content:`<table><tr><th>Checkpoint</th><th>What Happens</th></tr><tr><td><strong>Art Cat</strong></td><td>Provides mid-shift and EOD previews to the VL so corrections happen early, not at final delivery.</td></tr><tr><td><strong>Art Team Lead</strong></td><td>First review checkpoint. Checks for technical and stylistic compliance before escalating to the VL.</td></tr><tr><td><strong>Visual Lead</strong></td><td>Final sign-off. Asset is only cleared for production use once the VL has approved it.</td></tr></table><em>Note: Assets that fail are returned with specific, actionable revision notes. The cycle loops back to the Art Cat until the asset clears the VL.</em>`
  },
  { id:"11.3", section:"11. Pipelines & Workflows", title:"Playtesting and Build Reviews",
    keywords:["playtesting","build review","build","sprint end","integration","alpha","beta","visual peqa","peqa sheet"],
    content:`Playtest and build reviews should happen:<ul><li><strong>Top priority:</strong> every time a new build version is rolled out by dev</li><li><strong>Sprint end (bi-weekly):</strong> brief check-ins to maintain visual cohesion</li><li><strong>Integration points:</strong> when new art elements enter the build</li><li><strong>Pre-Alpha, Alpha, Beta:</strong> full review at each phase to inform the final polish pass</li></ul>After each build review, findings are parsed into a Visual PEQA sheet and submitted to the AD. The AD signs off before forwarding to Production and Dev for time cost and feasibility evaluation.`
  },
  { id:"12.1", section:"12. Goal Setting & Task Management", title:"SMART Goals",
    keywords:["smart goals","goal setting","task breakdown","specific measurable achievable relevant time-bound","task delegation","task cards"],
    content:`Every task delegated to the art team should be broken down using the SMART framework. If a task card cannot be broken into SMART sub-tasks, it is not ready to be assigned.<table><tr><th>Letter</th><th>What It Means</th></tr><tr><td><strong>S: Specific</strong></td><td>What needs to be done? Who is responsible? What steps does it require?</td></tr><tr><td><strong>M: Measurable</strong></td><td>How do we know when it is done? What does completion look like?</td></tr><tr><td><strong>A: Achievable</strong></td><td>Can the team actually accomplish this given current bandwidth and timeline?</td></tr><tr><td><strong>R: Relevant</strong></td><td>Does this task directly serve the current milestone goal?</td></tr><tr><td><strong>T: Time-bound</strong></td><td>When does it start? When is it due? What are the checkpoints?</td></tr></table>`
  },
  { id:"12.2", section:"12. Goal Setting & Task Management", title:"Pulse Sheet",
    keywords:["pulse sheet","personal tracker","task tracker","headlines","to do","wip","done","kicked back","workflow management"],
    content:`The pulse sheet is a personal task tracker that each VL maintains. Items flow in from discussions and standups, get broken into SMART sub-tasks, and move through <strong>Headlines → To-Do → WIP → Done → Kicked Back Tasks</strong>.<br><br>A Pulse Sheet template is available as a Google Sheet — create a copy and adjust the format as needed to better suit your workflow or project requirements.`
  },
  { id:"13.1", section:"13. Meetings & Reporting", title:"Standing Department Weeklies",
    keywords:["weekly meeting","department weekly","standup","slack huddle","monday","meeting minutes","action items","blockers"],
    content:`<ul><li>Conducted Monday or Tuesday depending on schedule</li><li>Participants: department heads, Art Manager, Art Director</li><li>Goal is under one hour — blockers and concerns first, goals second</li><li>Calls run through Slack huddle</li><li>Meeting minutes taken by the Art Manager and sent to the group chat immediately after</li><li>Action items parsed into each cat's pulse sheet after the call</li></ul>`
  },
  { id:"13.2", section:"13. Meetings & Reporting", title:"Postmortems",
    keywords:["postmortem","post mortem","retrospective","what went well","what went wrong","next steps","monthly review","action items"],
    content:`Postmortem Meetings are held at the end of each month. Each VL shares insights across:<ul><li><strong>What Went Well</strong> — Key accomplishments, effective workflows, successful collaboration, or practices worth continuing.</li><li><strong>What Went Wrong / Challenges Encountered</strong> — Workflow issues, blockers, communication gaps, missed timelines, or areas that need additional support.</li><li><strong>Next Steps / Action Items</strong> — Clear and actionable follow-up plans. Action items should include an assigned owner and a target timeline before the session concludes.</li></ul>Postmortem schedules are coordinated and finalized by EA Dom alongside the EST Visual Leads Representative, Piper.`
  },
  { id:"14.1", section:"14. Art Standards Reference", title:"Character Design",
    keywords:["character design","character evaluation","silhouette","readability","shape language","character color","character review"],
    content:`<strong>What makes it work:</strong><ul><li>Color and shape language communicate the character's role and personality before the player reads a single line of dialogue</li><li>Design decisions are consistent with the camera perspective the player will actually see</li><li>Every design choice serves one of the creative pillars</li></ul><strong>What makes it fail:</strong><ul><li>Designs that look good in isolation but read as generic within the game's world</li><li>Over-designed characters where detail density competes with readability at the intended resolution</li><li>Color palettes that make the character blend in when they should stand out</li></ul><strong>How to evaluate:</strong> Pull the character up at the intended camera distance and resolution. Can a player understand their purpose from their silhouette alone? Place them in a screenshot of the actual game environment.`
  },
  { id:"14.2", section:"14. Art Standards Reference", title:"Environment Design",
    keywords:["environment design","environment evaluation","environment review","environment color","lighting","props","world building","scene"],
    content:`<strong>What makes it work:</strong><ul><li>Environments serve as the stage for the narrative and gameplay, not just visual wallpaper</li><li>Color and shape language are consistent across assets within a location</li><li>Thematic lighting and post-processing reinforce the emotional tone of the scene</li></ul><strong>What makes it fail:</strong><ul><li>Environments that obscure gameplay-critical information</li><li>Inconsistent asset quality within the same environment</li><li>Lighting set up for a screenshot and not tested under actual camera movement</li></ul><strong>How to evaluate:</strong> Playtest the environment in the actual build. Identify the three most visually dominant elements in the scene — are those the right three?`
  },
  { id:"14.3", section:"14. Art Standards Reference", title:"UI Review Standards",
    keywords:["ui","user interface","hud","readability","ui evaluation","ui review","font","color hierarchy","screen design"],
    content:`<strong>What makes it work:</strong><ul><li>UI communicates information without the player needing to consciously look for it</li><li>Color, hierarchy, and layout serve the player's cognitive load</li><li>UI style is consistent with the game's overall visual language</li></ul><strong>What makes it fail:</strong><ul><li>UI that prioritizes visual novelty over readability, especially under time pressure during gameplay</li><li>Inconsistent font usage, color choices, or component styling across screens</li><li>UI designed for a static screenshot and not tested under actual gameplay conditions</li></ul><strong>How to evaluate:</strong> Run the game and do not look at the UI intentionally for 30 seconds. What did you absorb passively? What did you miss?`
  },
  { id:"14.4", section:"14. Art Standards Reference", title:"VFX Review Standards",
    keywords:["vfx","visual effects","vfx evaluation","vfx review","particle","performance","fx readability","effect","optimization"],
    content:`<strong>What makes it work:</strong><ul><li>VFX serve a purpose: they communicate information (hit confirmation, area of effect, status), establish tone, or reinforce the game's visual language</li><li>Scale, timing, and density are calibrated for the camera distance and gameplay speed</li><li>VFX are consistent with the visual style established in the art bible</li></ul><strong>What makes it fail:</strong><ul><li>VFX that obscure gameplay-critical information when combined with other effects</li><li>Effects not optimized, causing performance issues on the target platform</li><li>VFX that break stylistic consistency (e.g. a hyper-realistic explosion in a stylized cartoon game)</li></ul><strong>How to evaluate:</strong> Test effects in context with other simultaneous effects active, not in isolation.`
  },
  { id:"14.5", section:"14. Art Standards Reference", title:"Cinematography Review Standards",
    keywords:["cinematography","camera","framing","composition","shot","camera angles","camera movement"],
    content:`<strong>What makes it work:</strong><ul><li>Camera choices direct the player's attention to the correct subject without them realizing it</li><li>Framing, composition, and lighting work together to reinforce the emotional tone of the moment</li><li>Camera types and angles are consistent with the game's genre conventions</li></ul><strong>What makes it fail:</strong><ul><li>Camera movement that feels mechanical or unmotivated, drawing attention to itself</li><li>Framing that clips important elements or creates visual ambiguity</li></ul><strong>How to evaluate:</strong> View the scene from all camera angles documented in the art bible, not just the preferred angle.`
  },
  { id:"14.6", section:"14. Art Standards Reference", title:"Animation Review Standards",
    keywords:["animation","12 principles","squash and stretch","timing","anticipation","follow through","animation review","animation evaluation"],
    content:`<strong>What makes it work:</strong><ul><li>Animations serve the game's tone and are consistent with the character's visual design</li><li>The 12 principles are applied with intent — squash and stretch, anticipation, and follow-through are choices calibrated to the style</li><li>Animations are tested at the actual gameplay speed, not previewed in isolation</li></ul><strong>What makes it fail:</strong><ul><li>Animations that feel correct in the editor but feel wrong in gameplay</li><li>Inconsistent application of the 12 principles across characters in the same game</li></ul><strong>How to evaluate:</strong> Play the game and interact with every animated element you are reviewing. Do not approve animations from the editor alone.`
  },
  { id:"15.1", section:"15. KPI & Performance", title:"KPI Categories",
    keywords:["kpi","performance","review","evaluation","metrics","categories","leadership","cross-functional","visual standards"],
    content:`<ul><li><strong>Operations, Pipelines and Delivery</strong> — Capacity planning, pipeline stability, milestone readiness, risk identification</li><li><strong>Visual Standards and Documentation</strong> — Art bible accuracy, craft standard enforcement, version control discipline</li><li><strong>Leadership and Mentorship</strong> — Coaching effectiveness, feedback quality, team morale and psychological safety</li><li><strong>Cross-functional Impact</strong> — Stakeholder communication, strategic thinking, operational decision alignment</li></ul>KPI reviews are held every quarter, with 1-on-1s after each KPI period.`
  },
  { id:"16.1", section:"16. Resources & Tools", title:"Essential Resources and Tools",
    keywords:["resources","tools","gyazo","obs","figma","drawio","google sheets","documents","links","reference"],
    content:`<strong>Department Documents:</strong><ul><li>Visual Leads Dashboard (Hub Page)</li><li>Visual Lead — Team Bible</li><li>Unified Art Bible template</li><li>PEQA sheet template</li><li>Pulse Sheet Template</li><li>Visual Leads Department - Post Mortem (updated quarterly)</li></ul><strong>Tools:</strong><ul><li><strong>Gyazo</strong> — Screenshot and screen recording</li><li><strong>OBS</strong> — Screen recording for build reviews</li><li><strong>Google Sheets</strong> — Task tracking and asset request lists</li><li><strong>Figma</strong> — UI wireframes and visual comps</li><li><strong>Draw.io</strong> — Pipeline and flowchart documentation</li></ul>`
  }
];

const DEFAULT_SIDEBAR_CFG = [
  {
    id:'quicklinks', label:'Quick Links',
    items:[
      { id:'ql1', text:'VL Dashboard (Hub) — coming soon',       href:null, visible:true },
      { id:'ql2', text:'Unified Art Bible — coming soon',         href:null, visible:true },
      { id:'ql3', text:'PEQA Sheet Template — coming soon',       href:null, visible:true },
      { id:'ql4', text:'Pulse Sheet Template — coming soon',      href:null, visible:true },
      { id:'ql5', text:'VL Weekly Goals Sheet — coming soon',     href:null, visible:true },
      { id:'ql6', text:'Post Mortem Archive — coming soon',       href:null, visible:true },
      { id:'ql7', text:'EA Contact Sheet — coming soon',          href:null, visible:true }
    ]
  }
  // Team Directory is now a modal opened from the person-icon button in the sidebar header.
];

// Search synonym map — each inner array is a group of related/equivalent terms.
// The search algorithm auto-extends this from each entry's `keywords` at query time,
// so you mainly need to add groups here for cross-section concept bridges
// (e.g., "frequency" should pull in "cadence", "schedule", "quarterly", "weekly"…).
// Editable branding strings. Admin can change these via "⚙ Site Settings"
// and the new values propagate everywhere on the page + Firestore.
const DEFAULT_SITE_SETTINGS = {
  siteName:        'VL Dashboard',
  studioName:      'Mega Cat Studios',
  departmentName:  'Visual Leads Department',
  heroSub:         'Browse the handbook from the sidebar, or search for anything below.',
  handbookLabel:   'Handbook',
  quicklinksLabel: 'Quick Links',
  projectsLabel:   'Projects',
  favicon:         '',  // data URL of an .ico file (empty = use browser default)
  keywordSearchEnabled: true, // classic keyword / synonym / stemming search path
  aiSearchEnabled:      true, // semantic embedding search (Transformers.js MiniLM, in-browser)
  theme: {
    light: { accent: '#b87c00', bg: '#f5f5f3', text: '#0d0d0d', sidebarBg: '#fafaf8' },
    dark:  { accent: '#d4a843', bg: '#161616', text: '#ededeb', sidebarBg: '#111111' }
  }
};
const FAVICON_MAX_BYTES = 64 * 1024; // 64 KB cap

const DEFAULT_SYNONYMS = [
  ['frequency','cadence','often','schedule','when','recurrence','pace','rhythm','timing','how often','how frequent','how frequently'],
  ['kpi','performance','evaluation','review','metric','assessment','measure','measurement','rating'],
  ['pushback','feedback','concern','objection','criticism','disagreement','complaint','pushed back'],
  ['pipeline','workflow','process','flow','production flow','art pipeline'],
  ['art bible','style guide','art direction','visual direction','creative direction','art documentation'],
  ['onboarding','joining','starting','orientation','first week','first day','new project','kickoff'],
  ['preproduction','pre-production','planning phase','prep','before production'],
  ['mid-production','mid production','during production','in production','ongoing production'],
  ['post-production','postproduction','launch','polish','release','post-launch','dlc'],
  ['alignment','collaboration','coordination','sync','aligned','collab','team alignment'],
  ['approval','sign-off','signoff','approve','approved','cleared','green light','final approval'],
  ['vl','visual lead','visual leads','lead'],
  ['ad','art director'],
  ['asset','deliverable','artwork','art asset','art deliverable'],
  ['meeting','standup','sync','weekly','huddle','call','slack huddle'],
  ['communication','comms','messaging','channel'],
  ['mentor','mentoring','coaching','develop','support','guide','guiding'],
  ['task','work','assignment','job','responsibility','duty'],
  ['smart','goal','goals','objective','target','goal framework','specific measurable achievable'],
  ['pulse sheet','tracker','task tracker','personal tracker','to-do tracker'],
  ['postmortem','post-mortem','retrospective','retro','review meeting','monthly review'],
  ['character','character design','protagonist','figure'],
  ['environment','scene','world','background','level','location'],
  ['ui','user interface','hud','menu','screen','interface'],
  ['vfx','visual effects','effect','fx','particles','particle'],
  ['animation','animate','movement','motion','animated'],
  ['cinematography','camera','shot','framing','composition','camera angle'],
  ['tool','tools','software','app','application'],
  ['gyazo','screenshot','screen capture','screen recording'],
  ['obs','screen recording','capture'],
  ['figma','wireframe','mockup','ui design'],
  ['art cat','contributor','artist'],
  ['art team lead','team lead','lead artist'],
  ['producer','production','project management','art producer'],
  ['direction','creative direction','vision','guidance','art direction'],
  ['readability','clarity','legibility','visibility','clear'],
  ['playtest','playtesting','play test','test build','testing'],
  ['build','build review','milestone build','dev build'],
  ['scope','feasibility','scope creep','too much'],
  ['delegate','delegation','assign','hand off','task delegation'],
  ['blocker','blockers','blocked','stuck','impediment'],
  ['escalate','escalation','raise to','bring up','escalate to'],
  ['stakeholder','client','leadership','project leadership'],
  ['quarterly','every quarter','q1','q2','q3','q4','4 times a year','per quarter'],
  ['daily','every day','each day','day-to-day'],
  ['weekly','every week','each week','week-to-week'],
  ['monthly','every month','each month','month-to-month'],
  ['mood','tone','feel','atmosphere','vibe'],
  ['color','palette','hue','tint','color palette'],
  ['lighting','lights','illumination','lit'],
  ['style','aesthetic','look','visual style'],
  ['reference','ref','references','inspiration','refs'],
  ['peqa','visual peqa','review sheet','peqa sheet'],
  ['art subteam','art team','subteam','art sub-team','2d','3d'],
  ['hand off','handoff','transition','handover'],
  ['async','asynchronous','asynchronously','no meeting','no call']
];

/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */
let SECTIONS = [];          // Handbook section definitions
let HANDBOOK = [];          // Handbook entries
let PROJECTS = [];          // Project "section" definitions (parallel to SECTIONS)
let PROJECT_ENTRIES = [];   // Project entries (parallel to HANDBOOK)
let CUSTOM_CATEGORIES = []; // [{ id, label, sections: [{num,title,description}], entries: [...] }]
let SITE_SETTINGS = null;   // see DEFAULT_SITE_SETTINGS
let SIDEBAR_CFG = [];
// ── AI semantic search state (Transformers.js / MiniLM) ──
// EMBED_VERSION is bumped if the model or the embed-source format ever changes —
// any entry with a different _embV is re-embedded on next backfill pass.
const EMBED_VERSION = 1;
let EMBEDDER = null;          // singleton Transformers.js pipeline (set once load resolves)
let EMBEDDER_LOADING = null;  // in-flight Promise during model download; null when idle or ready
let EMBEDDER_FAILED = false;  // sticky flag: load was attempted and failed (keyword-only forever this session)
let BACKFILL_RUNNING = false; // prevents two backfill passes overlapping (e.g. user search triggers load while initial backfill is queued)
let ANNOUNCEMENTS = [];
let SYNONYMS = [];
let TEAM_DIRECTORY = [];
let dismissedAnns = new Set();
let expandedSections = new Set();  // tracks expanded sidebar groups — keys are "handbook:1" / "projects:1"
let collapsedCategories = new Set();  // main category IDs the user has collapsed in the sidebar
let unlockedProjects = new Set();     // project section nums where user entered the correct passkey this session

// ── Login / current user ──────────────────────────────────────────────────
// currentUser is the team member whose passkey was used at login (or null if
// the dashboard was unlocked via admin password without a specific identity).
// Only the holder of a profile's passkey can edit it; admins can edit anyone.
//
// Persistence: "Stay signed in for this session" stores in **sessionStorage** —
// survives refresh + same-tab navigation, ends when the browser is closed.
// Unchecked → no storage at all, so every refresh requires re-login (a strict
// opt-in for shared/public devices). localStorage is intentionally NOT used;
// a one-shot legacy migration in loadCurrentUser folds older localStorage
// sessions forward so existing users aren't surprise-signed-out.
let currentUser = null;             // { tmId, slackName, passkey } | null
let currentUserPersistent = false;  // true → stored in sessionStorage; false → not stored
const LOGIN_KEY = 'vl_session_user';

let isAdminMode = false;
let sidebarCollapsed = false;
let isDark = false;
let currentView = 'home';
let currentSectionNum = null;
let currentEntryId = null;
let currentBase = 'handbook';    // 'handbook' or 'projects'
let docViewBase = 'handbook';    // base currently shown in the Documentation View
let lightboxZoom = 1;

let dragSrcSection = null;
let dragSrcItemId = null;
let dragSrcType = null; // 'entry' | 'siItem'

let editEntryId = null;
let editEntryPresetId = null;     // preset (auto) id for a new entry/sub being created via the modal
let editEntryBase = 'handbook';   // base of the entry currently being edited
let editSectionNum = null;
let editSectionBase = 'handbook'; // base of the section being edited
let editSISection = null;
let editSIItemId = null;
let editAnnId = null;
let editEntrySrcSection = null;

let activeEditor = null;

/* ══════════════════════════════════════════
   PERSISTENCE
   ══════════════════════════════════════════ */
function loadFromStorage() {
  try { const v=localStorage.getItem('vl_sections'); SECTIONS = v ? JSON.parse(v) : clone(DEFAULT_SECTIONS); } catch(e){ SECTIONS=clone(DEFAULT_SECTIONS); }
  try { const v=localStorage.getItem('vl_hb');       HANDBOOK = v ? JSON.parse(v) : clone(DEFAULT_HANDBOOK); } catch(e){ HANDBOOK=clone(DEFAULT_HANDBOOK); }
  try { const v=localStorage.getItem('vl_projects'); PROJECTS = v ? JSON.parse(v) : []; } catch(e){ PROJECTS=[]; }
  try { const v=localStorage.getItem('vl_pe');       PROJECT_ENTRIES = v ? JSON.parse(v) : []; } catch(e){ PROJECT_ENTRIES=[]; }
  try { const v=localStorage.getItem('vl_cats');     CUSTOM_CATEGORIES = v ? JSON.parse(v) : []; } catch(e){ CUSTOM_CATEGORIES=[]; }
  try {
    const v=localStorage.getItem('vl_settings');
    SITE_SETTINGS = v ? Object.assign({}, DEFAULT_SITE_SETTINGS, JSON.parse(v)) : clone(DEFAULT_SITE_SETTINGS);
  } catch(e){ SITE_SETTINGS = clone(DEFAULT_SITE_SETTINGS); }
  try { const v=localStorage.getItem('vl_sb');       SIDEBAR_CFG = v ? JSON.parse(v) : clone(DEFAULT_SIDEBAR_CFG); } catch(e){ SIDEBAR_CFG=clone(DEFAULT_SIDEBAR_CFG); }
  try { const v=localStorage.getItem('vl_ann');      ANNOUNCEMENTS = v ? JSON.parse(v) : []; } catch(e){ ANNOUNCEMENTS=[]; }
  try { const v=localStorage.getItem('vl_syn');      SYNONYMS = v ? JSON.parse(v) : clone(DEFAULT_SYNONYMS); } catch(e){ SYNONYMS=clone(DEFAULT_SYNONYMS); }
  try { const v=localStorage.getItem('vl_team');     TEAM_DIRECTORY = v ? JSON.parse(v) : []; } catch(e){ TEAM_DIRECTORY=[]; }
  try { const v=localStorage.getItem('vl_dis');      dismissedAnns = new Set(v ? JSON.parse(v) : []); } catch(e){ dismissedAnns=new Set(); }
  try { const v=localStorage.getItem('vl_exp');      expandedSections = new Set(v ? JSON.parse(v) : []); } catch(e){ expandedSections=new Set(); }
  try { const v=localStorage.getItem('vl_cc');       collapsedCategories = new Set(v ? JSON.parse(v) : []); } catch(e){ collapsedCategories=new Set(); }
  // Project unlocks persist for THIS browser session via sessionStorage (cleared on browser close).
  try { const v=sessionStorage.getItem('vl_unlocked'); unlockedProjects = new Set(v ? JSON.parse(v) : []); } catch(e){ unlockedProjects=new Set(); }
  try { sidebarCollapsed = localStorage.getItem('vl_sc') === '1'; } catch(e){}
  try { isDark = localStorage.getItem('vl_dark') === '1'; } catch(e){}

  // ── Migrate legacy data ──
  // Old versions stored Handbook items + divider entries inside SIDEBAR_CFG.
  // The new sidebar auto-generates the Handbook section, so strip those.
  if (Array.isArray(SIDEBAR_CFG)) {
    // Strip legacy/obsolete sections: dividers, the old auto-handbook entry, and the
    // old "team" section (Team Directory is now a modal, not a sidebar section).
    const cleaned = SIDEBAR_CFG.filter(s =>
      s && !s.divider && Array.isArray(s.items) && s.id && s.id !== 'handbook' && s.id !== 'team'
    );
    // Make sure Quick Links exists
    const hasQL = cleaned.some(s => s.id === 'quicklinks');
    if (!hasQL) cleaned.push(clone(DEFAULT_SIDEBAR_CFG.find(s => s.id === 'quicklinks')));
    if (cleaned.length !== SIDEBAR_CFG.length) {
      SIDEBAR_CFG = cleaned;
      try { localStorage.setItem('vl_sb', JSON.stringify(SIDEBAR_CFG)); } catch(e){}
    } else {
      SIDEBAR_CFG = cleaned;
    }
  } else {
    SIDEBAR_CFG = clone(DEFAULT_SIDEBAR_CFG);
  }
  if (!Array.isArray(SECTIONS) || SECTIONS.length === 0) SECTIONS = clone(DEFAULT_SECTIONS);
  if (!Array.isArray(HANDBOOK) || HANDBOOK.length === 0) HANDBOOK = clone(DEFAULT_HANDBOOK);

  // Backfill passkeys for any existing team members that pre-date the passkey
  // system. New members get one in blankTm() so this is only relevant for
  // upgrade — but is also safe to run on every boot (no-op if all have one).
  _ensureTeamPasskeys();
}

function saveAll(label, opts) {
  localStorage.setItem('vl_sections', JSON.stringify(SECTIONS));
  localStorage.setItem('vl_hb',       JSON.stringify(HANDBOOK));
  localStorage.setItem('vl_projects', JSON.stringify(PROJECTS));
  localStorage.setItem('vl_pe',       JSON.stringify(PROJECT_ENTRIES));
  localStorage.setItem('vl_cats',     JSON.stringify(CUSTOM_CATEGORIES));
  localStorage.setItem('vl_settings', JSON.stringify(SITE_SETTINGS));
  localStorage.setItem('vl_sb',       JSON.stringify(SIDEBAR_CFG));
  localStorage.setItem('vl_ann',      JSON.stringify(ANNOUNCEMENTS));
  localStorage.setItem('vl_syn',      JSON.stringify(SYNONYMS));
  localStorage.setItem('vl_team',     JSON.stringify(TEAM_DIRECTORY));
  localStorage.setItem('vl_dis',      JSON.stringify([...dismissedAnns]));
  localStorage.setItem('vl_exp',      JSON.stringify([...expandedSections]));
  fbSync(); // push to Firebase if configured
  if (!opts || !opts.silent) showToast(label || 'Changes saved');
}

function saveSynonymsOnly() {
  localStorage.setItem('vl_syn', JSON.stringify(SYNONYMS));
  fbSyncKey('synonyms', SYNONYMS);
  showToast('Synonyms updated');
}

function saveTeamOnly() {
  localStorage.setItem('vl_team', JSON.stringify(TEAM_DIRECTORY));
  fbSyncKey('team', TEAM_DIRECTORY);
  showToast('Team directory saved');
}

function saveSidebarOnly() {
  localStorage.setItem('vl_hb', JSON.stringify(HANDBOOK));
  localStorage.setItem('vl_pe', JSON.stringify(PROJECT_ENTRIES));
  localStorage.setItem('vl_sb', JSON.stringify(SIDEBAR_CFG));
  fbSyncKey('handbook', HANDBOOK);
  fbSyncKey('projectEntries', PROJECT_ENTRIES);
  fbSyncKey('sidebar', SIDEBAR_CFG);
  showToast('Sidebar updated');
}

function saveAnnsOnly() {
  localStorage.setItem('vl_ann', JSON.stringify(ANNOUNCEMENTS));
  localStorage.setItem('vl_dis', JSON.stringify([...dismissedAnns]));
  fbSyncKey('announcements', ANNOUNCEMENTS);
}

function saveExpandedOnly() {
  localStorage.setItem('vl_exp', JSON.stringify([...expandedSections]));
}
function saveCollapsedCategories() {
  localStorage.setItem('vl_cc', JSON.stringify([...collapsedCategories]));
}
function toggleCategoryCollapsed(catId) {
  if (collapsedCategories.has(catId)) collapsedCategories.delete(catId);
  else collapsedCategories.add(catId);
  saveCollapsedCategories();
  renderSidebar();
}

// Called when the user clicks a main category label (Handbook, Projects, custom, Quick Links).
// Shows a thumbnail grid of all its top-level entries in the main area.
function navigateCategory(catId, type) {
  showCategoryOverview(catId, type);
}

function sectionNumOf(entryId) { return String(entryId).split('.')[0]; }
// Generalized helpers — accept an optional `base` ID:
//   'handbook' (default), 'projects', or a custom category id (e.g. 'cat-1701234567').
function sectionsOf(base) {
  base = base || 'handbook';
  if (base === 'handbook') return SECTIONS;
  if (base === 'projects') return PROJECTS;
  const cc = (Array.isArray(CUSTOM_CATEGORIES) ? CUSTOM_CATEGORIES : []).find(c => c.id === base);
  return cc ? cc.sections : SECTIONS; // safe fallback
}
function entriesOf(base) {
  base = base || 'handbook';
  if (base === 'handbook') return HANDBOOK;
  if (base === 'projects') return PROJECT_ENTRIES;
  const cc = (Array.isArray(CUSTOM_CATEGORIES) ? CUSTOM_CATEGORIES : []).find(c => c.id === base);
  return cc ? cc.entries : HANDBOOK;
}
function findSection(num, base) { return sectionsOf(base).find(s => s.num === String(num)); }
function findEntry(id, base) { return entriesOf(base).find(e => e.id === id); }
function entriesInSection(num, base) { return entriesOf(base).filter(e => sectionNumOf(e.id) === String(num)); }

/* ── NESTED-ENTRY HELPERS ──
   Entry IDs encode the tree: "14" (section) → "14.1" → "14.1.a" → "14.1.a.1".
   Depth = (# of dot-components) − 1. Section has depth 0.
*/
function idComponents(id) { return String(id).split('.'); }
function parentOf(id) {
  const c = idComponents(id);
  if (c.length <= 1) return null;          // section-level, no entry parent
  return c.slice(0, -1).join('.');
}
// Direct children only (one level deeper, same prefix).
function childrenOf(parentId, base) {
  const pid = String(parentId);
  const targetLen = idComponents(pid).length + 1;
  return entriesOf(base).filter(e => {
    const c = idComponents(e.id);
    return c.length === targetLen && e.id.startsWith(pid + '.');
  });
}
// All nested descendants (for delete cascade + counting).
function descendantsOf(parentId, base) {
  const prefix = String(parentId) + '.';
  return entriesOf(base).filter(e => e.id.startsWith(prefix) && e.id !== String(parentId));
}
function hasChildren(id, base) { return childrenOf(id, base).length > 0; }
// Depth-first descendants of a section/entry, in tree order (14.1, 14.1.a, 14.1.a.1, 14.1.b, 14.2…).
function entriesTreeOrder(parentId, base, acc) {
  acc = acc || [];
  for (const c of childrenOf(parentId, base)) { acc.push(c); entriesTreeOrder(c.id, base, acc); }
  return acc;
}
// Relative depth of an entry below its section (14.1 → 0, 14.1.a → 1, 14.1.a.1 → 2).
function entryDepthBelowSection(id) { return Math.max(0, idComponents(id).length - 2); }

// 0-indexed → a, b, …, z, aa, ab …
function letterFor(i) {
  let s = '';
  do { s = String.fromCharCode(97 + (i % 26)) + s; i = Math.floor(i / 26) - 1; } while (i >= 0);
  return s;
}
// Suggest the next available child ID under parentId. Levels alternate:
// depth 1 = number (14.1), depth 2 = letter (14.1.a), depth 3 = number (14.1.a.1)…
function suggestChildId(parentId, base) {
  const childLen = idComponents(parentId).length + 1; // # components the child will have
  const useLetter = (childLen % 2 === 1);              // odd length → letter
  const existing = new Set(childrenOf(parentId, base).map(e => idComponents(e.id).pop()));
  if (useLetter) {
    let i = 0;
    while (existing.has(letterFor(i))) i++;
    return parentId + '.' + letterFor(i);
  } else {
    let n = 1;
    while (existing.has(String(n))) n++;
    return parentId + '.' + n;
  }
}

function allBaseIds() {
  const out = ['handbook', 'projects'];
  for (const c of (CUSTOM_CATEGORIES || [])) if (c && c.id) out.push(c.id);
  return out;
}
// Lookup an entry by id across all bases — returns { entry, base } or null.
function findEntryAnywhere(id) {
  for (const base of allBaseIds()) {
    const e = entriesOf(base).find(x => x.id === id);
    if (e) return { entry: e, base };
  }
  return null;
}
function showToast(msg) {
  const t = document.getElementById('save-toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2000);
}

// Look up the display label for a top-level category (uses SITE_SETTINGS
// for built-ins, CUSTOM_CATEGORIES[].label for custom, fall back to SIDEBAR_CFG).
function getCategoryLabel(catId) {
  const s = SITE_SETTINGS || DEFAULT_SITE_SETTINGS;
  if (catId === 'handbook')  return s.handbookLabel  || 'Handbook';
  if (catId === 'projects')  return s.projectsLabel  || 'Projects';
  if (catId === 'quicklinks') return s.quicklinksLabel || 'Quick Links';
  const cc = (CUSTOM_CATEGORIES || []).find(c => c.id === catId);
  if (cc) return cc.label;
  const sec = (SIDEBAR_CFG || []).find(s => s.id === catId);
  return sec ? sec.label : catId;
}

// Apply all SITE_SETTINGS values to the live DOM (title, logo, hero, favicon, theme).
// Called once on init and after each Save in the settings modal.
function applyAllSettings() {
  const s = SITE_SETTINGS || DEFAULT_SITE_SETTINGS;
  // Document title
  document.title = `${s.siteName} — ${s.studioName}`;
  // Sidebar logo
  const studioLbl = document.querySelector('#sidebar-logo .studio-label');
  const siteH1    = document.querySelector('#sidebar-logo h1');
  if (studioLbl) studioLbl.textContent = s.studioName;
  if (siteH1)    siteH1.textContent    = s.siteName;
  // Home hero
  const heroLbl   = document.querySelector('#view-home .hero-label');
  const heroTitle = document.querySelector('#view-home .hero-title');
  const heroSub   = document.querySelector('#view-home .hero-sub');
  if (heroLbl)   heroLbl.textContent   = `${s.departmentName} · ${s.studioName}`;
  if (heroTitle) heroTitle.textContent = s.siteName;
  if (heroSub)   heroSub.textContent   = s.heroSub;
  // Favicon
  applyFavicon(s.favicon || '');
  // Theme
  applyTheme(s.theme);
}

/* ══════════════════════════════════════════
   INIT
   The boot sequence is now:
     1. loadFromStorage()                    — populates SITE_SETTINGS / TEAM_DIRECTORY etc.
     2. Apply theme + render sidebar (login overlay sits on top).
     3. _startFirebaseInBackground()         — kicks off Firebase init NON-BLOCKINGLY.
        Why up here instead of after login: a fresh browser (e.g. you created
        your profile in Opera, then opened Chrome) has no cached TEAM_DIRECTORY
        in localStorage, so the login passkey lookup would miss every time.
        Pre-fetching the remote team data in parallel with showing the login
        screen fixes that — by the time the user types their code, the
        directory is available. Refreshes also no longer flash a blocking
        "LOADING…" overlay; the maintenance overlay only appears if Firebase
        actually fails for an extended period.
     4. Decide login vs resume:
          - Session restored from sessionStorage → just paint the dashboard.
          - Otherwise                            → show the login screen.
     5. loginTry awaits the Firebase fetch when the local lookup misses, so
        cross-browser logins always see the latest team list.
   ══════════════════════════════════════════ */
loadFromStorage();
if (sidebarCollapsed) document.getElementById('sidebar').classList.add('collapsed');
applyDark(isDark);
applyAllSettings();
renderSidebar();
renderAnnouncements();
showHome();
_rtSetupVideoFallback();   // local-file: swap blocked video embeds for clickable posters

// Background Firebase pre-fetch — sets _fbInitPromise / _fbInitResult so
// loginTry can await it. Surfaces status via the #fb-status-dot in the
// sidebar; only escalates to the blocking "LOADING…" maintenance overlay
// on hard failure (after a grace period) or hang (12s timeout).
let _fbInitPromise = null;
let _fbInitResult  = null;  // null = pending, true = ok, false = failed
function _startFirebaseInBackground() {
  if (_fbInitPromise) return _fbInitPromise;

  const _fbDot = document.getElementById('fb-status-dot');
  if (_fbDot) {
    _fbDot.classList.remove('connected', 'offline');
    _fbDot.title = 'Connecting to shared dashboard…';
  }

  if (!fbConfigured()) {
    _fbInitResult = false;
    if (_fbDot) { _fbDot.classList.add('offline'); _fbDot.title = 'Running offline (no Firebase config). See FIREBASE_CONFIG in the file to enable sharing.'; }
    // Surface the "down" overlay shortly after boot so the user understands
    // why nothing is syncing — but don't BLOCK the page on it.
    setTimeout(() => { if (_fbInitResult === false && !_maintBypassed) showMaintenance('down'); }, 4000);
    _fbInitPromise = Promise.resolve(false);
    return _fbInitPromise;
  }

  _fbInitPromise = initFirebase().then(ok => {
    _fbInitResult = !!ok;
    if (ok) {
      // Hide the maintenance overlay if it had been escalated.
      hideMaintenance();
      // Repaint anything that may have changed from the remote pull —
      // sidebar (entries / projects / sections), announcements, and the
      // sign-out chip (slack name may have been edited remotely).
      renderSidebar();
      renderAnnouncements();
      _renderSignOutChip();
      if (_fbDot) { _fbDot.classList.add('connected'); _fbDot.title = 'Connected to shared dashboard'; }
      // Backfill any entries missing embeddings, deferred so boot stays snappy.
      setTimeout(() => runBackfillEmbeddings(), 1500);
    } else {
      if (_fbDot) { _fbDot.classList.add('offline'); _fbDot.title = 'Cannot reach the shared dashboard.'; }
      // Give the user a moment with whatever local data we have, then surface
      // the down overlay so it's clear something's wrong. Admin can bypass.
      setTimeout(() => { if (_fbInitResult === false && !_maintBypassed) showMaintenance('down'); }, 6000);
    }
    return ok;
  }).catch(e => {
    _fbInitResult = false;
    if (_fbDot) { _fbDot.classList.add('offline'); _fbDot.title = 'Firebase init error.'; }
    return false;
  });

  // Hard hang: if neither path settles in 12s, escalate to the overlay so
  // the user has the admin-bypass affordance and isn't staring at a dead UI.
  setTimeout(() => {
    if (_fbInitResult === null && !_maintBypassed) showMaintenance('down');
  }, 12000);

  return _fbInitPromise;
}

// Kick off Firebase NOW — non-blocking. The login screen will show
// immediately on top while this loads in the background.
_startFirebaseInBackground();

// Tracks whether this device's UID is a bound admin (new model). Set during
// resume + after admin bootstrap/promote.
let _boundIsAdmin = false;

// Decide login vs resume.
//  - OLD model: synchronous sessionStorage check (passkey validated locally).
//  - NEW model: the "is this device logged in?" answer is a Firestore read of
//    /users/{uid}, which needs Firebase ready — so we show the login overlay,
//    wait for init, then resume if the device is bound.
function _decideLoginOrResume() {
  if (!USE_NEW_DATA_MODEL) {
    const restored = loadCurrentUser();
    if (restored) _renderSignOutChip();   // straight to dashboard
    else showLogin();
    return;
  }
  // Avoid flashing the login overlay for a returning (bound) user: a
  // localStorage hint predicts resume so we keep the (cached) dashboard up
  // while we confirm the binding asynchronously. Cleared on sign-out / when
  // the binding turns out to be gone.
  let likelyBound = false;
  try { likelyBound = localStorage.getItem('vl_bound_hint') === '1'; } catch (e) {}
  if (!likelyBound) showLogin();   // no prior binding → show login immediately
  (async () => {
    try {
      await _fbInitPromise;
      if (_fbInitResult !== true) { if (likelyBound) showLogin(); return; }  // offline → must log in
      const bound = await fbBoundUser();
      const isAdm = await fbIsBoundAdmin();
      if (bound && bound.tmId) {
        // Bound team member (may also be an admin — lock button enters w/o pw).
        const m = (TEAM_DIRECTORY || []).find(x => x.id === bound.tmId)
                  || { id: bound.tmId, slackName: bound.slackName || '' };
        setCurrentUser(m, true);
        _boundIsAdmin = isAdm;
        try { localStorage.setItem('vl_bound_hint', '1'); } catch (e) {}
        _renderSignOutChip(); _runMainBootstrap(); hideLogin();
        return;
      }
      if (isAdm) {
        // Pure admin device (bootstrap admin, no team profile) — resume as admin.
        currentUser = null; _boundIsAdmin = true;
        isAdminMode = true; document.body.classList.add('admin-mode'); _swapAdminIcons(true);
        if (typeof dataMergeAdminPasskeys === 'function') dataMergeAdminPasskeys();
        try { localStorage.setItem('vl_bound_hint', '1'); } catch (e) {}
        _runMainBootstrap(); hideLogin();
        return;
      }
      // Not bound and not admin → clear stale hint and show login.
      try { localStorage.removeItem('vl_bound_hint'); } catch (e) {}
      showLogin();
    } catch (e) { console.error('resume binding check failed:', e); showLogin(); }
  })();
}
_decideLoginOrResume();

// Kept as a stub for the post-login welcome handoff (called from
// _bootProceedAfterLogin). Firebase already started; just refresh chrome
// in case the post-login state needs a final render.
function _runMainBootstrap() {
  renderSidebar();
  renderAnnouncements();
  _renderSignOutChip();
}

// Flush any debounced Firestore writes before the page unloads. Without
// this, hitting refresh during the 300ms debounce window (or before the
// network round-trip completes) drops the queued edit on the floor, and
// the next session re-pulls the stale remote doc — making the just-added
// entry vanish until the user waits long enough for the write to land.
function _fbHandleUnload() {
  if (_fbWriteTimer || Object.keys(_fbPendingWrite).length) {
    _fbFlushNow();
  }
}
window.addEventListener('pagehide',     _fbHandleUnload);
window.addEventListener('beforeunload', _fbHandleUnload);
