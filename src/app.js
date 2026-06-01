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
   FIREBASE DATA LAYER
   ──────────────────────────────────────────
   Fill in FIREBASE_CONFIG below to enable real-time sharing.
   Setup instructions:
   1. Go to https://console.firebase.google.com → "Add project" → name it (e.g. "vl-dashboard")
   2. Disable Google Analytics (not needed) → Create
   3. In project: Build → Firestore Database → Create database → Start in TEST MODE
      (Test mode lets anyone read/write for 30 days; renew or set rules later)
   4. In project Settings (⚙ icon) → General → Your apps → click </> "Web"
   5. Register the app, copy the firebaseConfig object
   6. Paste it into FIREBASE_CONFIG below replacing the placeholder
   7. Reload — the page will now sync data across all users in real time

   If FIREBASE_CONFIG.apiKey is left as 'PASTE_YOUR_CONFIG_HERE', the page falls
   back to localStorage (single-user mode), so the dashboard still works offline.
   ══════════════════════════════════════════ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBx1DVX_duRg1_ueNLoeg3fl5L4Of0a81c",
  authDomain: "mcs-vl-dashboard.firebaseapp.com",
  projectId: "mcs-vl-dashboard",
  storageBucket: "mcs-vl-dashboard.firebasestorage.app",
  messagingSenderId: "870550200391",
  appId: "1:870550200391:web:2ebe322f936391d0845162"
};
const FIREBASE_DOC_PATH = ['dashboards', 'main']; // collection, doc

let _fbApp = null, _fbDb = null, _fbDoc = null, _fbUnsub = null;
let _fbReady = false;
let _fbWriting = false;       // suppress our own writes triggering re-read
let _fbWriteTimer = null;
let _fbPendingWrite = {};     // accumulate writes for debounce

function fbConfigured() {
  return FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'PASTE_YOUR_CONFIG_HERE';
}

// Firestore doesn't allow nested arrays (array-of-array). SYNONYMS is one
// (each group is an array). We wrap each group as { terms: [...] } on write
// and unwrap on read. Other fields are objects-in-arrays, which Firestore allows.
function encodeForFirestore(key, value) {
  if (key === 'synonyms' && Array.isArray(value)) {
    return value.map(g => ({ terms: Array.isArray(g) ? g : [] }));
  }
  return value;
}
function decodeFromFirestore(key, value) {
  if (key === 'synonyms' && Array.isArray(value)) {
    // Accept both shapes for forward/backward compatibility
    return value.map(g => Array.isArray(g) ? g : (g && Array.isArray(g.terms) ? g.terms : []));
  }
  return value;
}

async function initFirebase() {
  if (!fbConfigured()) return false;
  try {
    // Use Firebase Web v10 modular SDK (loaded via CDN)
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js');
    const { getFirestore, doc, onSnapshot, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');
    _fbApp = initializeApp(FIREBASE_CONFIG);
    _fbDb  = getFirestore(_fbApp);
    _fbDoc = doc(_fbDb, FIREBASE_DOC_PATH[0], FIREBASE_DOC_PATH[1]);
    _fb_setDoc = setDoc;
    _fb_onSnapshot = onSnapshot;
    _fb_getDoc = getDoc;

    // If the previous session had unsaved writes pending (refresh happened
    // before the debounced fbSync fired or before the network round-trip
    // completed), the local cache is newer than Firestore for those keys.
    // Skip pulling them down — and re-push them up after we're ready.
    let pendingKeys = [];
    try {
      const raw = localStorage.getItem('vl_pending');
      if (raw) pendingKeys = JSON.parse(raw) || [];
    } catch(e) { pendingKeys = []; }
    const skip = new Set(pendingKeys);

    // First load from Firestore (if doc exists, overwrite local; if not, push local up)
    const snap = await getDoc(_fbDoc);
    if (snap.exists()) {
      const remote = snap.data() || {};
      if (remote.sections         && !skip.has('sections'))         SECTIONS          = decodeFromFirestore('sections', remote.sections);
      if (remote.handbook         && !skip.has('handbook'))         HANDBOOK          = decodeFromFirestore('handbook', remote.handbook);
      if (remote.projects         && !skip.has('projects'))         PROJECTS          = decodeFromFirestore('projects', remote.projects);
      if (remote.projectEntries   && !skip.has('projectEntries'))   PROJECT_ENTRIES   = decodeFromFirestore('projectEntries', remote.projectEntries);
      if (remote.customCategories && !skip.has('customCategories')) CUSTOM_CATEGORIES = decodeFromFirestore('customCategories', remote.customCategories);
      if (remote.settings         && !skip.has('settings'))         SITE_SETTINGS     = Object.assign({}, DEFAULT_SITE_SETTINGS, decodeFromFirestore('settings', remote.settings));
      if (remote.sidebar          && !skip.has('sidebar'))          SIDEBAR_CFG       = decodeFromFirestore('sidebar', remote.sidebar);
      if (remote.announcements    && !skip.has('announcements'))    ANNOUNCEMENTS     = decodeFromFirestore('announcements', remote.announcements);
      if (remote.synonyms         && !skip.has('synonyms'))         SYNONYMS          = decodeFromFirestore('synonyms', remote.synonyms);
      if (remote.team             && !skip.has('team'))             TEAM_DIRECTORY    = decodeFromFirestore('team', remote.team);
      if (!skip.has('team')) _ensureTeamPasskeys();  // backfill any pre-passkey rows in the remote doc
      // Persist what we just fetched to localStorage as cache (only for keys
      // we actually pulled from remote — leaving locally-dirty keys alone).
      try {
        if (!skip.has('sections'))         localStorage.setItem('vl_sections', JSON.stringify(SECTIONS));
        if (!skip.has('handbook'))         localStorage.setItem('vl_hb',       JSON.stringify(HANDBOOK));
        if (!skip.has('projects'))         localStorage.setItem('vl_projects', JSON.stringify(PROJECTS));
        if (!skip.has('projectEntries'))   localStorage.setItem('vl_pe',       JSON.stringify(PROJECT_ENTRIES));
        if (!skip.has('customCategories')) localStorage.setItem('vl_cats',     JSON.stringify(CUSTOM_CATEGORIES));
        if (!skip.has('settings'))         localStorage.setItem('vl_settings', JSON.stringify(SITE_SETTINGS));
        if (!skip.has('sidebar'))          localStorage.setItem('vl_sb',       JSON.stringify(SIDEBAR_CFG));
        if (!skip.has('announcements'))    localStorage.setItem('vl_ann',      JSON.stringify(ANNOUNCEMENTS));
        if (!skip.has('synonyms'))         localStorage.setItem('vl_syn',      JSON.stringify(SYNONYMS));
        if (!skip.has('team'))             localStorage.setItem('vl_team',     JSON.stringify(TEAM_DIRECTORY));
      } catch(e){}
    } else {
      // First-time: seed Firestore from local
      await setDoc(_fbDoc, {
        sections:         encodeForFirestore('sections',         SECTIONS),
        handbook:         encodeForFirestore('handbook',         HANDBOOK),
        projects:         encodeForFirestore('projects',         PROJECTS),
        projectEntries:   encodeForFirestore('projectEntries',   PROJECT_ENTRIES),
        customCategories: encodeForFirestore('customCategories', CUSTOM_CATEGORIES),
        settings:         encodeForFirestore('settings',         SITE_SETTINGS),
        sidebar:          encodeForFirestore('sidebar',          SIDEBAR_CFG),
        announcements:    encodeForFirestore('announcements',    ANNOUNCEMENTS),
        synonyms:         encodeForFirestore('synonyms',         SYNONYMS),
        team:             encodeForFirestore('team',             TEAM_DIRECTORY),
        _updatedAt: Date.now()
      });
    }

    // Real-time listener
    _fbUnsub = onSnapshot(_fbDoc, (snap) => {
      if (_fbWriting) return; // ignore our own write echo
      const raw = snap.data();
      if (!raw) return;
      const remote = {
        sections:         raw.sections         ? decodeFromFirestore('sections', raw.sections) : null,
        handbook:         raw.handbook         ? decodeFromFirestore('handbook', raw.handbook) : null,
        projects:         raw.projects         ? decodeFromFirestore('projects', raw.projects) : null,
        projectEntries:   raw.projectEntries   ? decodeFromFirestore('projectEntries', raw.projectEntries) : null,
        customCategories: raw.customCategories ? decodeFromFirestore('customCategories', raw.customCategories) : null,
        settings:         raw.settings         ? Object.assign({}, DEFAULT_SITE_SETTINGS, decodeFromFirestore('settings', raw.settings)) : null,
        sidebar:          raw.sidebar          ? decodeFromFirestore('sidebar', raw.sidebar) : null,
        announcements:    raw.announcements    ? decodeFromFirestore('announcements', raw.announcements) : null,
        synonyms:          raw.synonyms        ? decodeFromFirestore('synonyms', raw.synonyms) : null,
        team:             raw.team             ? decodeFromFirestore('team', raw.team) : null
      };
      let changed = false;
      if (remote.sections         && JSON.stringify(remote.sections)         !== JSON.stringify(SECTIONS))          { SECTIONS = remote.sections; changed = true; }
      if (remote.handbook         && JSON.stringify(remote.handbook)         !== JSON.stringify(HANDBOOK))          { HANDBOOK = remote.handbook; changed = true; }
      if (remote.projects         && JSON.stringify(remote.projects)         !== JSON.stringify(PROJECTS))          { PROJECTS = remote.projects; changed = true; }
      if (remote.projectEntries   && JSON.stringify(remote.projectEntries)   !== JSON.stringify(PROJECT_ENTRIES))   { PROJECT_ENTRIES = remote.projectEntries; changed = true; }
      if (remote.customCategories && JSON.stringify(remote.customCategories) !== JSON.stringify(CUSTOM_CATEGORIES)) { CUSTOM_CATEGORIES = remote.customCategories; changed = true; }
      if (remote.settings         && JSON.stringify(remote.settings)         !== JSON.stringify(SITE_SETTINGS))     { SITE_SETTINGS = remote.settings; changed = true; }
      if (remote.sidebar          && JSON.stringify(remote.sidebar)          !== JSON.stringify(SIDEBAR_CFG))       { SIDEBAR_CFG = remote.sidebar; changed = true; }
      if (remote.announcements    && JSON.stringify(remote.announcements)    !== JSON.stringify(ANNOUNCEMENTS))     { ANNOUNCEMENTS = remote.announcements; changed = true; }
      if (remote.synonyms         && JSON.stringify(remote.synonyms)         !== JSON.stringify(SYNONYMS))          { SYNONYMS = remote.synonyms; changed = true; }
      if (remote.team             && JSON.stringify(remote.team)             !== JSON.stringify(TEAM_DIRECTORY))    { TEAM_DIRECTORY = remote.team; changed = true; _ensureTeamPasskeys(); }
      if (changed) {
        applyAllSettings();
        renderSidebar();
        renderAnnouncements();
        if (currentView === 'section' && currentSectionNum) showSection(currentSectionNum);
        else if (currentView === 'entry' && currentEntryId) showEntry(currentEntryId);
        showToast('Updated from team');
      }
    });

    _fbReady = true;

    // Any keys that were locally-dirty when the previous session ended —
    // push them up now that Firestore is ready. The current in-memory
    // values came from localStorage (we deliberately did NOT overwrite
    // them from the remote snapshot above), so this re-publishes them.
    if (pendingKeys.length) {
      const valueFor = {
        sections: SECTIONS, handbook: HANDBOOK, projects: PROJECTS,
        projectEntries: PROJECT_ENTRIES, customCategories: CUSTOM_CATEGORIES,
        settings: SITE_SETTINGS, sidebar: SIDEBAR_CFG,
        announcements: ANNOUNCEMENTS, synonyms: SYNONYMS, team: TEAM_DIRECTORY
      };
      for (const k of pendingKeys) {
        if (k in valueFor) fbSyncKey(k, valueFor[k]);
      }
    }
    return true;
  } catch (err) {
    console.error('Firebase init failed:', err);
    showToast('Firebase failed — running offline');
    return false;
  }
}
let _fb_setDoc, _fb_onSnapshot, _fb_getDoc;

function fbSync() {
  if (!_fbReady) return;
  fbSyncKey('sections', SECTIONS);
  fbSyncKey('handbook', HANDBOOK);
  fbSyncKey('projects', PROJECTS);
  fbSyncKey('projectEntries', PROJECT_ENTRIES);
  fbSyncKey('customCategories', CUSTOM_CATEGORIES);
  fbSyncKey('settings', SITE_SETTINGS);
  fbSyncKey('sidebar', SIDEBAR_CFG);
  fbSyncKey('announcements', ANNOUNCEMENTS);
  fbSyncKey('synonyms', SYNONYMS);
  fbSyncKey('team', TEAM_DIRECTORY);
}

// Track which keys have edits that haven't yet landed in Firestore. This
// flag is also mirrored to localStorage so that if the user refreshes
// before the debounced write fires, the next session can detect that the
// local cache is newer than Firestore and push it up instead of being
// overwritten by stale remote data.
function _markPending(keys) {
  try {
    if (keys && keys.length) localStorage.setItem('vl_pending', JSON.stringify(keys));
    else                     localStorage.removeItem('vl_pending');
  } catch(e) {}
  _renderSaveIndicator(keys && keys.length > 0, false);
}

function _renderSaveIndicator(saving, justSaved) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  const label = el.querySelector('.si-label');
  if (saving) {
    if (label) label.textContent = 'Saving…';
    el.classList.add('show'); el.classList.remove('saved');
    clearTimeout(el._t);
  } else if (justSaved) {
    if (label) label.textContent = 'Saved';
    el.classList.add('show', 'saved');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 1500);
  } else {
    el.classList.remove('show', 'saved');
  }
}

// Fire the queued payload to Firestore right now, bypassing the debounce.
// Used by the page-unload handler so a refresh can't drop in-flight edits.
function _fbFlushNow() {
  if (!_fbReady || !_fb_setDoc) return;
  if (_fbWriteTimer) { clearTimeout(_fbWriteTimer); _fbWriteTimer = null; }
  if (!Object.keys(_fbPendingWrite).length) return;
  const payload = { ..._fbPendingWrite, _updatedAt: Date.now() };
  _fbPendingWrite = {};
  _fbWriting = true;
  // Fire-and-let-the-browser-finish-it: modern browsers keep this fetch in
  // flight through unload. We don't await; that would block the unload path.
  try {
    _fb_setDoc(_fbDoc, payload, { merge: true })
      .then(() => { _markPending([]); })
      .catch(err => console.error('Firestore flush failed:', err))
      .finally(() => { setTimeout(() => { _fbWriting = false; }, 200); });
  } catch (err) {
    console.error('Firestore flush threw:', err);
  }
}

function fbSyncKey(key, value) {
  if (!_fbReady) return;
  _fbPendingWrite[key] = encodeForFirestore(key, value);
  _markPending(Object.keys(_fbPendingWrite));
  if (_fbWriteTimer) clearTimeout(_fbWriteTimer);
  _fbWriteTimer = setTimeout(async () => {
    const payload = { ..._fbPendingWrite, _updatedAt: Date.now() };
    _fbPendingWrite = {};
    _fbWriting = true;
    try {
      await _fb_setDoc(_fbDoc, payload, { merge: true });
      // Only clear pending if no NEW writes piled on while we were in flight.
      if (!Object.keys(_fbPendingWrite).length) {
        _markPending([]);
        _renderSaveIndicator(false, true);
      }
    } catch (err) {
      console.error('Firestore write failed:', err);
      // Leave the pending flag set so the next session knows local is dirty.
    } finally {
      setTimeout(() => { _fbWriting = false; }, 200);
    }
  }, 300);
}

/* ══════════════════════════════════════════
   PERSISTENCE
   ══════════════════════════════════════════ */
function clone(o) { return JSON.parse(JSON.stringify(o)); }

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

/* ══════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════ */
function stripHtml(h)  { const d=document.createElement('div'); d.innerHTML=h; return (d.textContent||d.innerText||'').replace(/\s+/g,' ').trim(); }

/* ══════════════════════════════════════════
   KPI CSV PARSER
   Reads the quarterly Key-Performance-Indicator CSV exported from Google
   Sheets (see "KPI CSV Export Test - KPI Form - Art Directors.csv" for the
   reference template). The parser is STRICT: it expects the exact 4-category
   × 5-metric template, with required header fields (Name, Position,
   Evaluator Name, Evaluator Position, Scope) and a Scope cell of exactly
   "Q[1-4]-YYYY" (single, exact match — multiple values, missing year, or
   freeform text are rejected). On invalid input it returns
   { ok:false, error:"…" } so the upload UI can surface a clear message.
   ══════════════════════════════════════════ */

// Low-level CSV → 2D-array parser. Handles RFC-4180-style double-quoted
// cells that may contain commas and embedded newlines (Google Sheets emits
// these for multiline cells — the metric title+description rows depend on
// this). Doubled "" inside a quoted cell unescapes to a single ".
function _parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  const len = text.length;
  for (let i = 0; i < len; i++) {
    const ch = text[i];
    const next = i + 1 < len ? text[i + 1] : '';
    if (inQuotes) {
      if (ch === '"' && next === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell); cell = '';
      } else if (ch === '\n' || ch === '\r') {
        // Normalize CRLF — consume the LF after CR.
        if (ch === '\r' && next === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else {
        cell += ch;
      }
    }
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

function _kpiCell(rows, r, c) {
  return (rows[r] && rows[r][c] !== undefined) ? String(rows[r][c]).trim() : '';
}

// Public parser. Returns { ok:true, data:{…} } or { ok:false, error:"…" }.
function parseKpiCsv(text) {
  const rows = _parseCsv(text);
  if (!rows.length) return { ok: false, error: 'CSV is empty.' };

  // 1) Sniff: must look like a KPI sheet at all. The Google-Sheets template
  //    has the literal text "Key Performance Indicator" in row 2 col 2.
  const hasKpiMarker = rows.some(r =>
    (r || []).some(c => String(c || '').trim() === 'Key Performance Indicator')
  );
  if (!hasKpiMarker) return {
    ok: false,
    error: 'This doesn\'t look like a KPI form CSV — missing the "Key Performance Indicator" header.'
  };

  // 2) Header labels: find each by exact match in column 2. STRICT — each
  //    label must appear EXACTLY ONCE so we can't accidentally pick up a
  //    duplicate "Scope:" in a comment or copy-pasted section.
  const findExactlyOne = (label) => {
    const hits = [];
    for (let i = 0; i < rows.length; i++) {
      if (_kpiCell(rows, i, 2) === label) hits.push(i);
    }
    return hits;
  };
  const must = (label) => {
    const hits = findExactlyOne(label);
    if (hits.length === 0) return { error: `Missing "${label}" header row.` };
    if (hits.length > 1) return { error: `Multiple "${label}" rows found — there must be exactly one.` };
    return { row: hits[0] };
  };

  const checks = ['Name:', 'Position/Job Level:', 'Evaluator Name:', 'Evaluator Position:', 'Scope:']
    .map(L => ({ label: L, ...must(L) }));
  for (const c of checks) if (c.error) return { ok: false, error: c.error };
  const [nameRow, positionRow, evalNameRow, evalPosRow, scopeRow] = checks.map(c => c.row);

  // 3) Scope — the single most important validation per the spec. Must be
  //    EXACTLY "Q[1-4]-YYYY" in col 4 of the Scope row, with no other
  //    quarter-looking string anywhere else in the file. Reject otherwise.
  const scopeText = _kpiCell(rows, scopeRow, 4);
  const scopeMatch = /^Q([1-4])-(\d{4})$/.exec(scopeText);
  if (!scopeMatch) return {
    ok: false,
    error: 'Scope cell must be exactly "Q1-YYYY", "Q2-YYYY", "Q3-YYYY", or "Q4-YYYY" ' +
           '(e.g. "Q1-2026"). Found: ' + (scopeText ? `"${scopeText}"` : '(empty)') + '.'
  };
  // Additional sanity: make sure no OTHER cell in the sheet contains a
  // standalone "Q[1-4]-YYYY" string. (Comments mentioning quarters in
  // free-form prose like "Q1 review" are fine; the strict pattern is what
  // we're guarding against — "multiple values" per the spec.)
  let strayScope = null;
  for (let i = 0; i < rows.length; i++) {
    if (i === scopeRow) continue;
    for (let c = 0; c < (rows[i] || []).length; c++) {
      const v = _kpiCell(rows, i, c);
      if (/^Q[1-4]-\d{4}$/.test(v)) { strayScope = { row: i, col: c, value: v }; break; }
    }
    if (strayScope) break;
  }
  if (strayScope) return {
    ok: false,
    error: `Multiple scope values detected — extra "${strayScope.value}" found outside the Scope row. Only one scope per CSV.`
  };

  const scopeQuarter = parseInt(scopeMatch[1], 10);
  const scopeYear    = parseInt(scopeMatch[2], 10);

  // 4) Header meta — straightforward text reads.
  const nameVal             = _kpiCell(rows, nameRow, 4);
  const positionVal         = _kpiCell(rows, positionRow, 4);
  const evaluatorName       = _kpiCell(rows, evalNameRow, 4);
  const evaluatorPosition   = _kpiCell(rows, evalPosRow, 4);
  const overallScoreRaw     = _kpiCell(rows, positionRow, 10);
  const overallScore        = parseFloat(overallScoreRaw);
  const overallLabel        = _kpiCell(rows, scopeRow, 10);

  // 5) Find category title rows. A category header is a row where col 1 has
  //    text and ALL other columns are empty. Exclude the topmost "Key
  //    Performance Indicator" marker and the "Score Range" sub-headers.
  const categoryStarts = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] || [];
    const c1 = (r[1] || '').trim();
    if (!c1) continue;
    if (c1 === 'Score Range' || c1 === 'Key Performance Indicator') continue;
    const restEmpty = r.slice(2).every(c => !String(c || '').trim());
    if (!restEmpty) continue;
    categoryStarts.push({ rowIdx: i, title: c1 });
  }
  if (categoryStarts.length !== 4) return {
    ok: false,
    error: `Expected exactly 4 categories, found ${categoryStarts.length}.`
  };

  // 6) Parse each category in turn. Within the row range belonging to that
  //    category, locate the rating header row ("5,4,3,2,1,,Score"), the
  //    subtotal row immediately below it, and 5 metric rows.
  const categories = [];
  for (let i = 0; i < 4; i++) {
    const start = categoryStarts[i];
    const end   = i + 1 < 4 ? categoryStarts[i + 1].rowIdx : rows.length;

    // Score Range descriptions: rows where col 1 = "Score Range", col 4 is
    // the rating (5..1), col 5 is the description text.
    const scoreDescriptions = { 1:'', 2:'', 3:'', 4:'', 5:'' };
    for (let k = start.rowIdx; k < end; k++) {
      if (_kpiCell(rows, k, 1) === 'Score Range') {
        const rating = parseInt(_kpiCell(rows, k, 4), 10);
        if (rating >= 1 && rating <= 5) scoreDescriptions[rating] = _kpiCell(rows, k, 5);
        // continue — there are 5 of these rows but only the first has the
        // "Score Range" label. The rest below just have the rating in col 4.
        // Read continuation: scan downward while col 4 is 1..5.
        for (let k2 = k + 1; k2 < end; k2++) {
          const ratingRaw = _kpiCell(rows, k2, 4);
          const rating2 = parseInt(ratingRaw, 10);
          if (rating2 >= 1 && rating2 <= 5 && !_kpiCell(rows, k2, 1)) {
            scoreDescriptions[rating2] = _kpiCell(rows, k2, 5);
          } else if (ratingRaw === '' && !_kpiCell(rows, k2, 5)) {
            // empty row — keep scanning a couple rows before giving up
            continue;
          } else {
            break;
          }
        }
        break;
      }
    }

    // Rating header row.
    let headerRowIdx = -1;
    for (let k = start.rowIdx; k < end; k++) {
      if (_kpiCell(rows, k, 3) === '5' && _kpiCell(rows, k, 4) === '4' &&
          _kpiCell(rows, k, 5) === '3' && _kpiCell(rows, k, 6) === '2' &&
          _kpiCell(rows, k, 7) === '1' && _kpiCell(rows, k, 9) === 'Score') {
        headerRowIdx = k; break;
      }
    }
    if (headerRowIdx < 0) return {
      ok: false,
      error: `Category "${start.title}" is missing the rating header row (5,4,3,2,1,,Score).`
    };
    const subtotalRowIdx = headerRowIdx + 1;
    const subtotal = parseFloat(_kpiCell(rows, subtotalRowIdx, 9)) || 0;

    // Metric rows: scan from subtotal+1 forward. A metric row has a non-
    // empty col 1 (title+description) AND non-trivial rating cells. A
    // comment row has empty col 1 and "Comments/Recommendations:" in col 3.
    const metrics = [];
    for (let k = subtotalRowIdx + 1; k < end && metrics.length < 5; k++) {
      const titleDesc = (rows[k] && rows[k][1] || '').trim();
      if (!titleDesc) continue;
      if (_kpiCell(rows, k, 3) === 'Comments/Recommendations:') continue;

      const ratingCells = [3, 4, 5, 6, 7].map(c => parseFloat(_kpiCell(rows, k, c)) || 0);
      // Cells map left→right to ratings 5,4,3,2,1.
      let rating = 0, score = 0;
      for (let m = 0; m < 5; m++) {
        if (ratingCells[m] > 0) {
          rating = 5 - m;
          score  = ratingCells[m];
          break;
        }
      }
      // Cell at col 8 is the per-metric total. Fall back to `score` if blank.
      const total  = parseFloat(_kpiCell(rows, k, 8));
      const finalScore = isFinite(total) && total > 0 ? total : score;
      const weight   = rating > 0 ? +(finalScore / rating).toFixed(3) : 0;
      const maxScore = +(weight * 5).toFixed(3);

      const lines = titleDesc.split(/\r?\n/);
      const mTitle = (lines[0] || '').trim();
      const mDesc  = lines.slice(1).join('\n').trim();

      // Comment lives in the very next row, col 4 onwards (concatenate any
      // non-empty cells in case the comment was split across columns).
      let comment = '';
      const commentRow = rows[k + 1] || [];
      if ((commentRow[3] || '').trim() === 'Comments/Recommendations:') {
        comment = commentRow.slice(4).map(c => String(c || '').trim()).filter(Boolean).join(' ').trim();
      }

      metrics.push({ title: mTitle, description: mDesc, rating, weight, score: finalScore, maxScore, comment });
    }
    if (metrics.length !== 5) return {
      ok: false,
      error: `Category "${start.title}" has ${metrics.length} metrics; expected 5.`
    };

    // Max-subtotal: subtotal is the average of metric scores, so the
    // theoretical max is also the average of metric maxes.
    const maxSubtotal = +(metrics.reduce((a, m) => a + m.maxScore, 0) / 5).toFixed(3);
    categories.push({ title: start.title, scoreDescriptions, subtotal, maxSubtotal, metrics });
  }

  // Overall max = sum of all four category max-subtotals.
  const overallMax = +categories.reduce((a, c) => a + c.maxSubtotal, 0).toFixed(3);

  return {
    ok: true,
    data: {
      meta: {
        name: nameVal,
        position: positionVal,
        evaluatorName,
        evaluatorPosition,
        scope: { quarter: scopeQuarter, year: scopeYear, key: `${scopeYear}-Q${scopeQuarter}`, raw: scopeText },
        overall: isFinite(overallScore) ? overallScore : 0,
        overallMax: overallMax || 100,
        overallLabel
      },
      categories,
      _parsedAt: Date.now()
    }
  };
}

// Current quarter helpers — used by the upload UI to block future quarters
// and by the year/quarter picker to mark "missing" past quarters.
function _currentQuarter(date) {
  const d = date || new Date();
  return { year: d.getFullYear(), quarter: Math.floor(d.getMonth() / 3) + 1 };
}
function _isFutureQuarter(year, quarter) {
  const cur = _currentQuarter();
  if (year > cur.year) return true;
  if (year === cur.year && quarter > cur.quarter) return true;
  return false;
}
function _scopeKey(year, quarter) { return `${year}-Q${quarter}`; }
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
   DARK MODE
   ══════════════════════════════════════════ */
function applyDark(d) {
  isDark = d;
  document.body.classList.toggle('dark', d);
  const icon = document.getElementById('dark-icon');
  if (d) {
    icon.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  } else {
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  }
}
function toggleDark() {
  applyDark(!isDark);
  try { localStorage.setItem('vl_dark', isDark ? '1' : '0'); } catch(e){}
}

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  try { localStorage.setItem('vl_sc', sidebarCollapsed ? '1' : '0'); } catch(e){}
}

/* ══════════════════════════════════════════
   NAVIGATION (views)
   ══════════════════════════════════════════ */
function setView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  currentView = name;
  window.scrollTo(0, 0);
  // Show back-to-home FAB only when reading content (not on home or doc view)
  const fab = document.getElementById('back-to-home-fab');
  if (fab) fab.classList.toggle('visible', name === 'section' || name === 'entry' || name === 'category');
}

function updateBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  let parts = [`<span class="bc-item" onclick="showHome()">${escapeHtml(SITE_SETTINGS.siteName || 'Dashboard')}</span>`];
  const baseLabel = getCategoryLabel(currentBase);
  if (currentView === 'category' && currentCategoryId) {
    let catLabel = 'Category';
    catLabel = getCategoryLabel(currentCategoryId);
    parts.push(`<span class="bc-sep">/</span><span class="bc-item active">${escapeHtml(catLabel)}</span>`);
  } else if (currentView === 'section' && currentSectionNum) {
    const sec = findSection(currentSectionNum, currentBase);
    if (sec) {
      parts.push(`<span class="bc-sep">/</span><span class="bc-item">${escapeHtml(baseLabel)}</span>`);
      parts.push(`<span class="bc-sep">/</span><span class="bc-item active">${escapeHtml(sec.num + '. ' + sec.title)}</span>`);
    }
  } else if (currentView === 'entry' && currentEntryId) {
    const entry = findEntry(currentEntryId, currentBase);
    if (entry) {
      const secNum = sectionNumOf(entry.id);
      const sec = findSection(secNum, currentBase);
      parts.push(`<span class="bc-sep">/</span><span class="bc-item">${escapeHtml(baseLabel)}</span>`);
      if (sec) parts.push(`<span class="bc-sep">/</span><span class="bc-item" onclick="showSection('${escJsAttr(secNum)}','${escJsAttr(currentBase)}')">${escapeHtml(sec.num + '. ' + sec.title)}</span>`);
      // Walk the ancestor entry chain (e.g. 14.1 → 14.1.a → current) so each level is clickable.
      const chain = [];
      let pid = parentOf(entry.id);
      while (pid && idComponents(pid).length >= 2) { // stop before the section-only id
        const anc = findEntry(pid, currentBase);
        if (anc) chain.unshift(anc);
        pid = parentOf(pid);
      }
      for (const anc of chain) {
        parts.push(`<span class="bc-sep">/</span><span class="bc-item" onclick="showEntry('${escJsAttr(anc.id)}','${escJsAttr(currentBase)}')">${escapeHtml(anc.title)}</span>`);
      }
      parts.push(`<span class="bc-sep">/</span><span class="bc-item active">${escapeHtml(entry.title)}</span>`);
    }
  } else if (currentView === 'docview') {
    parts.push(`<span class="bc-sep">/</span><span class="bc-item active">📑 Documentation View</span>`);
  }
  bc.innerHTML = parts.join('');
}

function showHome() {
  pauseInlineVideos();
  currentSectionNum = null; currentEntryId = null;
  setView('home'); updateBreadcrumb();
  renderAnnouncements();
  renderSidebar();
}

function expandKey(base, num) { return (base||'handbook') + ':' + String(num); }

// A clickable card for an entry (used in section view + entry view child grids).
function entryCardHtml(e, base, canEdit) {
  const kids = childrenOf(e.id, base).length;
  const badge = kids ? ` · ${kids} sub-${kids===1?'entry':'entries'}` : '';
  const excerpt = (() => {
    const txt = stripHtml(e.content || '');
    return txt.length > 90 ? txt.slice(0, 90) + '…' : txt;
  })();
  return `<div class="section-card" data-entry-id="${escAttr(e.id)}" onclick="showEntry('${escJsAttr(e.id)}','${escJsAttr(base)}')">
    <div class="section-card-id">${escapeHtml(e.id)}${badge}</div>
    <div class="section-card-title">${escapeHtml(e.title)}</div>
    ${excerpt ? `<div style="font-size:12px;color:var(--mid);margin-top:5px;line-height:1.4">${escapeHtml(excerpt)}</div>` : ''}
    ${canEdit ? `<div class="section-card-actions">
      <button onclick="event.stopPropagation();openEntryEditor('${escJsAttr(e.id)}','${escJsAttr(base)}')" title="Edit">✎</button>
    </div>` : ''}
  </div>`;
}

function showSection(num, base) {
  pauseInlineVideos();
  base = base || 'handbook';
  currentBase = base;
  currentSectionNum = String(num); currentEntryId = null;
  const sec = findSection(num, base);
  if (!sec) { showHome(); return; }
  document.getElementById('sv-num').textContent = base === 'projects' ? `Project ${sec.num}` : `Section ${sec.num}`;
  document.getElementById('sv-title').textContent = `${sec.num}. ${sec.title}`;
  const svDesc = document.getElementById('sv-desc');
  svDesc.innerHTML = sec.description || '';
  svDesc.querySelectorAll('img').forEach(img => img.classList.add('entry-img'));
  // Section view shows only DIRECT children of the section (e.g. 14.1, 14.2 — not 14.1.a)
  const entries = childrenOf(num, base);
  const canEdit = canEditSection(base, num);
  const grid = document.getElementById('sv-grid');
  grid.innerHTML = entries.map(e => entryCardHtml(e, base, canEdit)).join('')
    + (canEdit ? `<div class="add-card" onclick="openNewEntryEditor('${escJsAttr(num)}','${escJsAttr(base)}')">＋ Add Entry</div>` : '');

  // ── Render the section-actions row based on access level ──
  // Real admin: "Edit Section Info" (incl. passkey + delete)
  // Project + passkey unlocked: "Edit Mode Active" badge + "Edit Section Info"
  //                              (scoped admin: rename/edit description, NOT delete or passkey)
  //                              + "Exit Edit Mode"
  // Project + locked: the "Enter Edit Mode" CTA
  // Handbook + non-admin: nothing
  const actionsEl = document.getElementById('sv-actions');
  let actionsHtml = '';
  if (isAdminMode) {
    actionsHtml = `<button class="btn btn-secondary" onclick="openSectionEditor('${escJsAttr(num)}','${escJsAttr(base)}')">⚙ Edit Section Info</button>`;
  } else if (base === 'projects') {
    if (unlockedProjects.has(String(num))) {
      actionsHtml = `
        <span class="edit-mode-active">Edit Mode Active for this section</span>
        <button class="btn btn-secondary" onclick="openSectionEditor('${escJsAttr(num)}','${escJsAttr(base)}')">⚙ Edit Section Info</button>
        <button class="btn btn-secondary" onclick="lockProjectSection('${escJsAttr(num)}')">🔒 Exit Edit Mode</button>
      `;
    } else {
      actionsHtml = `<button class="btn btn-cta-edit" onclick="promptUnlockProjectSection('${escJsAttr(num)}')">🔑 Enter Edit Mode</button>`;
    }
  }
  actionsEl.innerHTML = actionsHtml;

  expandedSections.add(expandKey(base, num)); saveExpandedOnly();
  setView('section'); updateBreadcrumb(); renderSidebar();
}

function showEntry(id, base, highlightQuery) {
  pauseInlineVideos();
  base = base || 'handbook';
  // If caller didn't specify base but the id only exists in projects, find it
  if (!findEntry(id, base)) {
    const found = findEntryAnywhere(id);
    if (found) base = found.base;
  }
  currentBase = base;
  const entry = findEntry(id, base);
  if (!entry) { showHome(); return; }
  currentEntryId = id; currentSectionNum = sectionNumOf(id);

  document.getElementById('ev-id').textContent = `${entry.id} · ${entry.section}`;
  document.getElementById('ev-title').textContent = entry.title;
  const content = document.getElementById('ev-content');
  content.innerHTML = entry.content;
  // Mark images for lightbox
  content.querySelectorAll('img').forEach(img => img.classList.add('entry-img'));

  // If we arrived here from a search result, briefly flash the matched
  // tokens inside the entry so the user sees *why* it matched.
  if (highlightQuery) flashSearchMatches(content, highlightQuery);

  // Show/hide "Edit Entry" button based on access level for this section
  const canEdit = canEditSection(base, currentSectionNum);
  const editBtn = document.querySelector('#view-entry .entry-actions .btn');
  if (editBtn) editBtn.style.display = canEdit ? 'inline-flex' : 'none';

  // ── Sub-entries (direct children of this entry) ──
  const kids = childrenOf(id, base);
  const childWrap = document.getElementById('ev-children-wrap');
  const childGrid = document.getElementById('ev-children-grid');
  if (kids.length || canEdit) {
    childWrap.style.display = '';
    childGrid.innerHTML = kids.map(k => entryCardHtml(k, base, canEdit)).join('')
      + (canEdit ? `<div class="add-card" onclick="openNewSubEntry('${escJsAttr(id)}','${escJsAttr(base)}')">＋ Add Sub-Entry</div>` : '');
    document.getElementById('ev-children-label').style.display = (kids.length || canEdit) ? '' : 'none';
  } else {
    childWrap.style.display = 'none';
  }

  expandedSections.add(expandKey(base, currentSectionNum));
  expandedSections.add(expandKey(base, id)); // expand this entry's branch in sidebar
  saveExpandedOnly();
  setView('entry'); updateBreadcrumb(); renderSidebar();
}

// Back button: go to the entry's PARENT (entry or section), not just the section.
function backToSection() {
  if (currentView === 'entry' && currentEntryId) {
    const pid = parentOf(currentEntryId);
    if (pid && findEntry(pid, currentBase)) { showEntry(pid, currentBase); return; }
  }
  if (currentSectionNum) showSection(currentSectionNum, currentBase);
  else showHome();
}

// Open the entry editor pre-filled to create a child of parentId.
function openNewSubEntry(parentId, base) {
  base = base || currentBase || 'handbook';
  const sectionNum = sectionNumOf(parentId);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need edit access to add sub-entries.');
    return;
  }
  openNewEntryEditor(sectionNum, base, suggestChildId(parentId, base));
}

let currentCategoryId = null;     // id of category currently in overview view
let currentCategoryType = null;   // 'kb' or 'links'

// Show the category overview: a thumbnail card grid of all top-level entries
// in the given category. catType is 'kb' for sectioned KBs, 'links' for Quick-Links.
function showCategoryOverview(catId, catType) {
  pauseInlineVideos();
  currentCategoryId = catId;
  currentCategoryType = catType;
  currentSectionNum = null; currentEntryId = null;
  if (catType === 'kb') currentBase = catId; // handbook/projects/custom id

  const labelEl = document.getElementById('cv-label');
  const titleEl = document.getElementById('cv-title');
  const descEl  = document.getElementById('cv-desc');
  const grid    = document.getElementById('cv-grid');

  if (catType === 'kb') {
    const sectionsArr = sectionsOf(catId);
    const isCustom = (catId !== 'handbook' && catId !== 'projects');
    const friendlyLabel = getCategoryLabel(catId);
    labelEl.textContent = friendlyLabel;
    titleEl.textContent = `${friendlyLabel} — Overview`;
    descEl.innerHTML = `<span style="color:var(--mid)">All ${escapeHtml(friendlyLabel.toLowerCase())} sections at a glance. Click a card to dive in.</span>`
      + (isCustom && isAdminMode ? `<div style="margin-top:10px"><button class="btn btn-secondary" onclick="openEditCategoryModal('${escJsAttr(catId)}')">⚙ Rename / Delete Category</button></div>` : '');

    let cards = sectionsArr.map(sec => {
      const childCount = entriesInSection(sec.num, catId).length;
      const descText = stripHtml(sec.description || '');
      const excerpt = descText.length > 130 ? descText.substring(0, 130) + '…' : descText;
      return `<div class="section-card" onclick="showSection('${escJsAttr(sec.num)}','${escJsAttr(catId)}')">
        <div class="section-card-id">
          <span class="section-card-num">${escapeHtml(sec.num)}</span>
          <span class="section-card-entries">${childCount} ${childCount === 1 ? 'entry' : 'entries'}</span>
        </div>
        <div class="section-card-title">${escapeHtml(sec.title)}</div>
        ${excerpt ? `<div style="font-size:12px;color:var(--mid);margin-top:6px;line-height:1.45">${escapeHtml(excerpt)}</div>` : ''}
        ${isAdminMode ? `<div class="section-card-actions"><button onclick="event.stopPropagation();openSectionEditor('${escJsAttr(sec.num)}','${escJsAttr(catId)}')" title="Edit">✎</button></div>` : ''}
      </div>`;
    }).join('');
    if (sectionsArr.length === 0) {
      cards = `<div style="grid-column:1/-1;text-align:center;color:var(--mid);padding:30px 0;font-style:italic">No ${escapeHtml(friendlyLabel.toLowerCase())} sections yet.</div>`;
    }
    if (isAdminMode) {
      cards += `<div class="add-card" onclick="openNewSectionEditor('${escJsAttr(catId)}')">＋ Add ${escapeHtml(friendlyLabel === 'Projects' ? 'Project' : 'Section')}</div>`;
    }
    grid.innerHTML = cards;
  } else if (catType === 'links') {
    // Quick Links — show each link as a card
    const sec = SIDEBAR_CFG.find(s => s.id === catId);
    if (!sec) { showHome(); return; }
    const qlLabel = getCategoryLabel(catId);
    labelEl.textContent = qlLabel;
    titleEl.textContent = `${qlLabel} — Overview`;
    descEl.innerHTML = `<span style="color:var(--mid)">All quick links at a glance. Click a card to open the link.</span>`;

    const items = sec.items.filter(i => i && i.id && (i.visible || isAdminMode));
    let cards = items.map(item => {
      const isPlaceholder = !item.href;
      const onclick = item.href
        ? `window.open('${escJsAttr(item.href)}', '_blank', 'noopener')`
        : '';
      return `<div class="section-card${isPlaceholder?' add-card':''}" ${onclick?`onclick="${onclick}"`:''} style="${isPlaceholder?'cursor:default':''}">
        <div class="section-card-id">${isPlaceholder ? 'placeholder' : '🔗 link'}</div>
        <div class="section-card-title">${escapeHtml(item.text)}</div>
        ${item.href ? `<div style="font-size:11px;color:var(--mid);margin-top:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(item.href)}</div>` : ''}
        ${isAdminMode ? `<div class="section-card-actions"><button onclick="event.stopPropagation();openSIEditor('${escJsAttr(catId)}','${escJsAttr(item.id)}')" title="Edit">✎</button></div>` : ''}
      </div>`;
    }).join('');
    if (items.length === 0) {
      cards = `<div style="grid-column:1/-1;text-align:center;color:var(--mid);padding:30px 0;font-style:italic">No links yet.</div>`;
    }
    if (isAdminMode) {
      cards += `<div class="add-card" onclick="openNewSIEditor('${escJsAttr(catId)}')">＋ Add Link</div>`;
    }
    grid.innerHTML = cards;
  }

  setView('category');
  updateBreadcrumb();
  renderSidebar();
}

function lookupCustomCategoryLabel(catId) {
  if (typeof CUSTOM_CATEGORIES === 'undefined' || !Array.isArray(CUSTOM_CATEGORIES)) return null;
  const cc = CUSTOM_CATEGORIES.find(c => c.id === catId);
  return cc ? cc.label : null;
}

/* ══════════════════════════════════════════
   SITE SETTINGS (admin)
   ══════════════════════════════════════════ */
function openSiteSettings() {
  if (!isAdminMode) return;
  const s = SITE_SETTINGS || DEFAULT_SITE_SETTINGS;
  document.getElementById('set-siteName').value        = s.siteName        || '';
  document.getElementById('set-studioName').value      = s.studioName      || '';
  document.getElementById('set-departmentName').value  = s.departmentName  || '';
  document.getElementById('set-heroSub').value         = s.heroSub         || '';
  document.getElementById('set-kwSearch').checked      = s.keywordSearchEnabled !== false;
  document.getElementById('set-aiSearch').checked      = s.aiSearchEnabled      !== false;
  // Live warning when both toggles are off
  const updateBothOffWarning = () => {
    const kw = document.getElementById('set-kwSearch').checked;
    const ai = document.getElementById('set-aiSearch').checked;
    document.getElementById('search-both-off-warning').style.display = (!kw && !ai) ? 'block' : 'none';
  };
  document.getElementById('set-kwSearch').onchange = updateBothOffWarning;
  document.getElementById('set-aiSearch').onchange = updateBothOffWarning;
  updateBothOffWarning();

  // Favicon preview + clear button
  _settingsFaviconDraft = s.favicon || '';
  _renderFaviconPreview();

  // Theme color pickers
  const t = (s.theme && s.theme.light) ? s.theme : DEFAULT_SITE_SETTINGS.theme;
  document.getElementById('theme-light-accent').value  = t.light.accent;
  document.getElementById('theme-light-bg').value      = t.light.bg;
  document.getElementById('theme-light-text').value    = t.light.text;
  document.getElementById('theme-light-sidebar').value = t.light.sidebarBg;
  document.getElementById('theme-dark-accent').value   = t.dark.accent;
  document.getElementById('theme-dark-bg').value       = t.dark.bg;
  document.getElementById('theme-dark-text').value     = t.dark.text;
  document.getElementById('theme-dark-sidebar').value  = t.dark.sidebarBg;

  // Live preview on color change
  _settingsThemeDraft = JSON.parse(JSON.stringify(t));
  ['theme-light-accent','theme-light-bg','theme-light-text','theme-light-sidebar',
   'theme-dark-accent','theme-dark-bg','theme-dark-text','theme-dark-sidebar'
  ].forEach(id => {
    const el = document.getElementById(id);
    el.oninput = () => {
      const mode = id.indexOf('light') > -1 ? 'light' : 'dark';
      const key  = id.split('-').pop(); // accent / bg / text / sidebar
      const slot = key === 'sidebar' ? 'sidebarBg' : key;
      _settingsThemeDraft[mode][slot] = el.value;
      applyTheme(_settingsThemeDraft);
    };
  });

  document.getElementById('settings-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('set-siteName').focus(), 60);
}
function closeSettingsModal() {
  document.getElementById('settings-modal-overlay').classList.remove('open');
  // Revert any live preview to what's actually saved
  applyTheme(SITE_SETTINGS.theme);
  _settingsFaviconDraft = null;
  _settingsThemeDraft = null;
}
function maybeCloseSettings(e) { if (_shouldCloseOverlay(e, 'settings-modal-overlay')) closeSettingsModal(); }

let _settingsFaviconDraft = null;
let _settingsThemeDraft = null;

function saveSiteSettings() {
  const wasAiOn = SITE_SETTINGS && SITE_SETTINGS.aiSearchEnabled !== false;
  const aiOn = document.getElementById('set-aiSearch').checked;
  const kwOn = document.getElementById('set-kwSearch').checked;
  const next = Object.assign({}, SITE_SETTINGS, {
    siteName:        document.getElementById('set-siteName').value.trim()        || DEFAULT_SITE_SETTINGS.siteName,
    studioName:      document.getElementById('set-studioName').value.trim()      || DEFAULT_SITE_SETTINGS.studioName,
    departmentName:  document.getElementById('set-departmentName').value.trim()  || DEFAULT_SITE_SETTINGS.departmentName,
    heroSub:         document.getElementById('set-heroSub').value.trim()         || DEFAULT_SITE_SETTINGS.heroSub,
    keywordSearchEnabled: kwOn,
    aiSearchEnabled:      aiOn,
    favicon:         _settingsFaviconDraft != null ? _settingsFaviconDraft : (SITE_SETTINGS.favicon || ''),
    theme:           _settingsThemeDraft || SITE_SETTINGS.theme || DEFAULT_SITE_SETTINGS.theme
  });
  SITE_SETTINGS = next;
  // If AI search was just enabled, start indexing in the background.
  if (!wasAiOn && aiOn) setTimeout(() => runBackfillEmbeddings(), 300);
  // Close before calling functions that might trigger renders
  document.getElementById('settings-modal-overlay').classList.remove('open');
  saveAll('Site settings saved');
  applyAllSettings();
  renderSidebar();
  updateBreadcrumb();
  if (currentView === 'category' && currentCategoryId) showCategoryOverview(currentCategoryId, currentCategoryType);
}
async function resetSiteSettings() {
  if (!await customConfirm('Reset all site settings (including theme + favicon) to defaults? Your customizations will be lost.', { danger: true, confirmLabel: 'Reset' })) return;
  SITE_SETTINGS = clone(DEFAULT_SITE_SETTINGS);
  closeSettingsModal();
  saveAll('Reset to defaults');
  applyAllSettings();
  renderSidebar();
  // Reopen with refreshed values
  setTimeout(openSiteSettings, 30);
}

// ── Favicon upload ──
function uploadFavicon() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.ico,image/x-icon,image/vnd.microsoft.icon';
  inp.onchange = ev => {
    const file = ev.target.files[0];
    if (!file) return;
    const isIco = /\.ico$/i.test(file.name) || file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon';
    if (!isIco) {
      alert('Please upload a .ico file (standard favicon format).');
      return;
    }
    if (file.size > FAVICON_MAX_BYTES) {
      alert(`Favicon is too large (${(file.size/1024).toFixed(1)} KB). Maximum ${FAVICON_MAX_BYTES/1024} KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      _settingsFaviconDraft = e.target.result;
      _renderFaviconPreview();
      applyFavicon(_settingsFaviconDraft); // live preview
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}
function clearFavicon() {
  _settingsFaviconDraft = '';
  _renderFaviconPreview();
  applyFavicon('');
}
function _renderFaviconPreview() {
  const wrap = document.getElementById('favicon-preview');
  const clearBtn = document.getElementById('favicon-clear-btn');
  if (!wrap) return;
  const url = _settingsFaviconDraft != null ? _settingsFaviconDraft : (SITE_SETTINGS.favicon || '');
  if (url) {
    wrap.innerHTML = `<img src="${escAttr(url)}" alt="favicon" style="width:32px;height:32px;object-fit:contain">`;
    if (clearBtn) clearBtn.style.display = '';
  } else {
    wrap.innerHTML = `<span style="color:var(--mid);font-size:10px">none</span>`;
    if (clearBtn) clearBtn.style.display = 'none';
  }
}

// ── Inline category rename (admin only) ──
async function renameCategoryInline(catId) {
  if (!isAdminMode) return;
  const currentLabel = getCategoryLabel(catId);
  const next = await customPrompt(`Rename "${currentLabel}" to:`, currentLabel, {
    title: 'Rename category', placeholder: 'New name', confirmLabel: 'Rename'
  });
  if (next === null) return;
  const trimmed = next.trim();
  if (!trimmed) { alert('Category name cannot be empty.'); return; }
  if (catId === 'handbook')        SITE_SETTINGS.handbookLabel = trimmed;
  else if (catId === 'projects')   SITE_SETTINGS.projectsLabel = trimmed;
  else if (catId === 'quicklinks') SITE_SETTINGS.quicklinksLabel = trimmed;
  else {
    const cc = (CUSTOM_CATEGORIES || []).find(c => c.id === catId);
    if (cc) cc.label = trimmed;
    else { alert('Unknown category.'); return; }
  }
  saveAll('Category renamed');
  applyAllSettings();
  renderSidebar();
  updateBreadcrumb();
  if (currentView === 'category' && currentCategoryId === catId) showCategoryOverview(catId, currentCategoryType);
}

// ── Favicon application ──
function applyFavicon(dataUrl) {
  const url = (dataUrl == null) ? (SITE_SETTINGS.favicon || '') : dataUrl;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (url) { link.type = 'image/x-icon'; link.href = url; }
  else { link.removeAttribute('href'); }
}

// ── Theme application ──
// Injects a <style id="theme-overrides"> block that overrides CSS variables.
function applyTheme(theme) {
  const t = theme || SITE_SETTINGS.theme || DEFAULT_SITE_SETTINGS.theme;
  const l = t.light || DEFAULT_SITE_SETTINGS.theme.light;
  const d = t.dark  || DEFAULT_SITE_SETTINGS.theme.dark;
  const css = `
:root {
  --admin-accent: ${l.accent};
  --white: ${l.bg};
  --black: ${l.text};
  --bg-sidebar: ${l.sidebarBg};
}
body.dark {
  --admin-accent: ${d.accent};
  --white: ${d.bg};
  --black: ${d.text};
  --bg-sidebar: ${d.sidebarBg};
}
  `;
  let styleEl = document.getElementById('theme-overrides');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-overrides';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

/* ══════════════════════════════════════════
   CUSTOM CATEGORIES (admin)
   ══════════════════════════════════════════ */
let _editingCategoryId = null;

function openNewCategoryModal() {
  if (!isAdminMode) return;
  _editingCategoryId = null;
  document.getElementById('cat-modal-title-text').textContent = 'New Category';
  document.getElementById('cat-label-input').value = '';
  document.getElementById('delete-cat-btn').style.display = 'none';
  document.getElementById('cat-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('cat-label-input').focus(), 60);
}
function openEditCategoryModal(catId) {
  if (!isAdminMode) return;
  const cc = CUSTOM_CATEGORIES.find(c => c.id === catId);
  if (!cc) return;
  _editingCategoryId = catId;
  document.getElementById('cat-modal-title-text').textContent = 'Edit Category';
  document.getElementById('cat-label-input').value = cc.label || '';
  document.getElementById('delete-cat-btn').style.display = '';
  document.getElementById('cat-modal-overlay').classList.add('open');
}
function closeCatModal() { document.getElementById('cat-modal-overlay').classList.remove('open'); }
function maybeCloseCat(e) { if (_shouldCloseOverlay(e, 'cat-modal-overlay')) closeCatModal(); }
function saveCategory() {
  const label = document.getElementById('cat-label-input').value.trim();
  if (!label) { alert('Category label is required.'); return; }
  if (_editingCategoryId) {
    const cc = CUSTOM_CATEGORIES.find(c => c.id === _editingCategoryId);
    if (cc) cc.label = label;
  } else {
    CUSTOM_CATEGORIES.push({
      id: 'cat-' + Date.now(),
      label,
      sections: [],
      entries: []
    });
  }
  closeCatModal();
  saveAll('Category saved');
  renderSidebar();
}
async function deleteCurrentCategory() {
  if (!_editingCategoryId) return;
  const cc = CUSTOM_CATEGORIES.find(c => c.id === _editingCategoryId);
  if (!cc) return;
  const hasContent = (cc.sections && cc.sections.length) || (cc.entries && cc.entries.length);
  const msg = hasContent
    ? `Category "${cc.label}" contains ${cc.sections.length} section(s) and ${cc.entries.length} entries. Delete EVERYTHING in this category permanently?`
    : `Delete category "${cc.label}"?`;
  if (!await customConfirm(msg, { danger: true, confirmLabel: 'Delete category' })) return;
  CUSTOM_CATEGORIES = CUSTOM_CATEGORIES.filter(c => c.id !== _editingCategoryId);
  if (currentBase === _editingCategoryId) showHome();
  closeCatModal();
  saveAll('Category deleted');
  renderSidebar();
}

/* ══════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════ */
function renderSidebar() {
  try { _renderSidebarUnsafe(); }
  catch (err) {
    console.error('renderSidebar failed:', err);
    // Recover by resetting to defaults and trying once more
    SECTIONS = clone(DEFAULT_SECTIONS);
    HANDBOOK = clone(DEFAULT_HANDBOOK);
    SIDEBAR_CFG = clone(DEFAULT_SIDEBAR_CFG);
    try { _renderSidebarUnsafe(); } catch(e2) {
      document.getElementById('sidebar-sections-container').innerHTML =
        '<div style="padding:20px;font-size:12px;color:#c0392b">Sidebar failed to render. Open DevTools (F12) for details, or click ↑ Import in Admin Mode to restore.</div>';
    }
  }
}

// Recursively render one entry row + (if expanded) its child branches.
function _renderEntryBranch(entry, base, canEdit, depth) {
  const kids = childrenOf(entry.id, base);
  const hasKids = kids.length > 0;
  const key = expandKey(base, entry.id);
  const isExpanded = expandedSections.has(key);
  const isActive = currentView === 'entry' && currentBase === base && currentEntryId === entry.id;
  const indent = 8 + depth * 12; // px left padding per nesting level

  const chevron = hasKids
    ? `<span class="sb-chevron${isExpanded?' expanded':''}" onclick="event.stopPropagation();toggleSectionExpand('${escJsAttr(entry.id)}','${escJsAttr(base)}')">▶</span>`
    : `<span class="sb-chevron" style="visibility:hidden">▶</span>`;
  const editBtn = canEdit
    ? `<button class="sb-edit-btn" onclick="event.stopPropagation();openEntryEditor('${escJsAttr(entry.id)}','${escJsAttr(base)}')" title="Edit entry">✎</button>`
    : '';
  const addSubBtn = canEdit
    ? `<button class="sb-add-btn" onclick="event.stopPropagation();openNewSubEntry('${escJsAttr(entry.id)}','${escJsAttr(base)}')" title="Add sub-entry">＋</button>`
    : '';

  let html = `<div class="sb-child${isActive?' active':''}" style="padding-left:${indent}px" data-entry-id="${escAttr(entry.id)}" data-section-num="${escAttr(sectionNumOf(entry.id))}" data-base="${escAttr(base)}" ${canEdit?'draggable="true"':''}>
    ${canEdit ? `<span class="drag-handle" title="Drag to reorder">⠿</span>` : ''}
    ${chevron}
    <span class="sb-child-text" onclick="showEntry('${escJsAttr(entry.id)}','${escJsAttr(base)}')">${escapeHtml(entry.id + ' ' + entry.title)}</span>
    ${addSubBtn}
    ${editBtn}
  </div>`;

  if (hasKids && isExpanded) {
    html += `<div class="sb-subchildren${isExpanded?' expanded':''}">`;
    for (const k of kids) html += _renderEntryBranch(k, base, canEdit, depth + 1);
    html += `</div>`;
  }
  return html;
}

function _renderKbSection(base, label, sectionsArr, emptyHint, addLabel) {
  // The 'base' value IS the category ID for KB-type sections (handbook/projects/custom).
  const catId = base;
  const collapsed = collapsedCategories.has(catId);
  let html = `<div class="sidebar-section">
    <div class="sidebar-section-label sb-cat-label" onclick="event.stopPropagation();navigateCategory('${escJsAttr(catId)}','kb')">
      <span class="sb-cat-chevron${collapsed?'':' expanded'}" onclick="event.stopPropagation();toggleCategoryCollapsed('${escJsAttr(catId)}')">▶</span>
      <span class="sb-cat-text">${escapeHtml(label)}</span>
      <button class="sb-cat-rename" onclick="event.stopPropagation();renameCategoryInline('${escJsAttr(catId)}')" title="Rename this category">✎</button>
    </div>
    <div class="sb-cat-body${collapsed?' collapsed':''}">`;
  if (sectionsArr.length === 0 && !isAdminMode) {
    html += `<div style="font-size:12px;color:var(--mid);font-style:italic;padding:2px 8px 4px">${escapeHtml(emptyHint)}</div>`;
  }
  for (const sec of sectionsArr) {
    const key = expandKey(base, sec.num);
    const isExpanded = expandedSections.has(key);
    const isActiveParent = currentView === 'section' && currentBase === base && currentSectionNum === sec.num;
    const canEdit = canEditSection(base, sec.num);
    const isProjectsNonAdmin = base === 'projects' && !isAdminMode;
    const lockBtn = isProjectsNonAdmin
      ? (unlockedProjects.has(String(sec.num))
          ? `<button class="sb-lock-btn unlocked" onclick="event.stopPropagation();lockProjectSection('${escJsAttr(sec.num)}')" title="Click to lock this section's edit access">🔓</button>`
          : `<button class="sb-lock-btn" onclick="event.stopPropagation();promptUnlockProjectSection('${escJsAttr(sec.num)}')" title="Enter passkey to edit this section">🔒</button>`)
      : '';
    const sectionEditBtn = isAdminMode
      ? `<button class="sb-edit-btn" onclick="event.stopPropagation();openSectionEditor('${escJsAttr(sec.num)}','${escJsAttr(base)}')" title="Edit section info (admin only)">⚙</button>`
      : '';
    const addEntryBtn = canEdit
      ? `<button class="sb-add-btn" onclick="event.stopPropagation();openNewEntryEditor('${escJsAttr(sec.num)}','${escJsAttr(base)}')" title="Add entry">＋</button>`
      : '';
    html += `<div class="sb-parent${isActiveParent?' active':''}" data-section-num="${escAttr(sec.num)}" data-base="${escAttr(base)}">
      <span class="sb-chevron${isExpanded?' expanded':''}" onclick="event.stopPropagation();toggleSectionExpand('${escJsAttr(sec.num)}','${escJsAttr(base)}')">▶</span>
      <span class="sb-parent-text" onclick="showSection('${escJsAttr(sec.num)}','${escJsAttr(base)}')">${escapeHtml(sec.num + '. ' + sec.title)}</span>
      ${lockBtn}
      ${sectionEditBtn}
      ${addEntryBtn}
    </div>
    <div class="sb-children${isExpanded?' expanded':''}" data-section-num="${escAttr(sec.num)}" data-base="${escAttr(base)}">`;
    // Render the entry tree recursively (direct children of the section, each expandable)
    for (const e of childrenOf(sec.num, base)) {
      html += _renderEntryBranch(e, base, canEdit, 0);
    }
    if (canEdit) html += `<button class="admin-add-btn" onclick="openNewEntryEditor('${escJsAttr(sec.num)}','${escJsAttr(base)}')">＋ Add Entry</button>`;
    html += `</div>`;
  }
  // Adding a new TOP-LEVEL section/project is admin-only (passkey unlock is scoped to one section).
  if (isAdminMode) html += `<button class="admin-add-btn" onclick="openNewSectionEditor('${escJsAttr(base)}')">＋ ${escapeHtml(addLabel)}</button>`;
  html += `</div></div><div class="sb-divider"></div>`;
  return html;
}

function _renderSidebarUnsafe() {
  const c = document.getElementById('sidebar-sections-container');
  let html = '';

  // HANDBOOK
  html += _renderKbSection('handbook', getCategoryLabel('handbook'), SECTIONS,
    'No handbook sections.', 'Add New Section');

  // SIDEBAR_CFG sections (Quick Links)
  for (const section of SIDEBAR_CFG) {
    if (!section || !Array.isArray(section.items) || !section.id) continue;
    const collapsed = collapsedCategories.has(section.id);
    html += `<div class="sidebar-section">
      <div class="sidebar-section-label sb-cat-label" onclick="event.stopPropagation();navigateCategory('${escJsAttr(section.id)}','links')">
        <span class="sb-cat-chevron${collapsed?'':' expanded'}" onclick="event.stopPropagation();toggleCategoryCollapsed('${escJsAttr(section.id)}')">▶</span>
        <span class="sb-cat-text">${escapeHtml(getCategoryLabel(section.id) || section.label || '')}</span>
        <button class="sb-cat-rename" onclick="event.stopPropagation();renameCategoryInline('${escJsAttr(section.id)}')" title="Rename this category">✎</button>
      </div>
      <div class="sb-cat-body${collapsed?' collapsed':''}">`;
    for (const item of section.items) {
      if (!item || !item.id) continue;
      if (!item.visible && !isAdminMode) continue;
      const inner = item.href
        ? `<span class="sb-link-text"><a href="${escAttr(item.href)}" target="_blank" rel="noopener">${escapeHtml(item.text)}</a></span>`
        : `<span class="sb-link-text placeholder">${escapeHtml(item.text)}</span>`;
      // Admin-only affordances for Quick Links (drag + edit)
      const adminAffordances = isAdminMode ? `<span class="drag-handle" title="Drag to reorder">⠿</span>` : '';
      const editBtn = isAdminMode ? `<button class="sb-edit-btn" onclick="event.stopPropagation();openSIEditor('${escJsAttr(section.id)}','${escJsAttr(item.id)}')" title="Edit link">✎</button>` : '';
      html += `<div class="sb-link" data-section-id="${escAttr(section.id)}" data-item-id="${escAttr(item.id)}" ${isAdminMode?'draggable="true"':''}>
        ${adminAffordances}
        ${inner}
        ${editBtn}
      </div>`;
    }
    if (isAdminMode) {
      html += `<button class="admin-add-btn" onclick="openNewSIEditor('${escJsAttr(section.id)}')">＋ Add Link</button>`;
    }
    html += `</div></div><div class="sb-divider"></div>`;
  }

  // PROJECTS (after Quick Links)
  html += _renderKbSection('projects', getCategoryLabel('projects'), PROJECTS,
    'No projects yet. Sign in as admin to add one.', 'Add New Project');

  // Custom categories (admin can add) — render each one with the same KB UX
  for (const cat of (CUSTOM_CATEGORIES || [])) {
    if (!cat || !cat.id) continue;
    if (!Array.isArray(cat.sections)) cat.sections = [];
    if (!Array.isArray(cat.entries)) cat.entries = [];
    html += _renderKbSection(cat.id, cat.label || 'Untitled Category', cat.sections,
      `No sections yet in ${cat.label || 'this category'}.`, 'Add New Section');
  }

  // Admin-only: "Add Category" at the very bottom
  if (isAdminMode) {
    html += `<div class="sidebar-section">
      <button class="admin-add-btn" style="margin-top:4px" onclick="openNewCategoryModal()">＋ Add New Category</button>
    </div>`;
  }

  c.innerHTML = html;
  attachSidebarDnD();
}

function toggleSectionExpand(num, base) {
  base = base || 'handbook';
  const key = expandKey(base, num);
  if (expandedSections.has(key)) expandedSections.delete(key);
  else expandedSections.add(key);
  saveExpandedOnly();
  renderSidebar();
}

/* ══════════════════════════════════════════
   DRAG & DROP
   ══════════════════════════════════════════ */
function attachSidebarDnD() {
  // Entries (draggable within section)
  document.querySelectorAll('.sb-child[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => onDragStart(e, 'entry'));
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDropEntry);
    el.addEventListener('dragend', onDragEnd);
  });
  // SI Items
  document.querySelectorAll('.sb-link[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => onDragStart(e, 'siItem'));
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDropSI);
    el.addEventListener('dragend', onDragEnd);
  });
}

function onDragStart(e, type) {
  if (!isAdminMode) { e.preventDefault(); return; }
  if (!e.target.closest('.drag-handle')) { e.preventDefault(); return; }
  dragSrcType = type;
  if (type === 'entry') {
    dragSrcSection = e.currentTarget.dataset.sectionNum;
    dragSrcItemId = e.currentTarget.dataset.entryId;
  } else {
    dragSrcSection = e.currentTarget.dataset.sectionId;
    dragSrcItemId = e.currentTarget.dataset.itemId;
  }
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSrcItemId);
  setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
}
function onDragOver(e) {
  if (!isAdminMode || !dragSrcItemId) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  clearDragStyles();
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.classList.add(e.clientY < rect.top + rect.height / 2 ? 'drag-over-above' : 'drag-over-below');
}
function onDragLeave(e) { e.currentTarget.classList.remove('drag-over-above','drag-over-below'); }
function onDragEnd() { clearDragStyles(); dragSrcType=dragSrcSection=dragSrcItemId=null; }
function clearDragStyles() {
  document.querySelectorAll('.drag-over-above,.drag-over-below,.dragging').forEach(el => el.classList.remove('drag-over-above','drag-over-below','dragging'));
}

function onDropEntry(e) {
  e.preventDefault();
  if (!isAdminMode || dragSrcType !== 'entry') return;
  const tgtSection = e.currentTarget.dataset.sectionNum;
  const tgtEntryId = e.currentTarget.dataset.entryId;
  const tgtBase = e.currentTarget.dataset.base || 'handbook';
  const srcBase = (document.querySelector('.sb-child.dragging')||{}).dataset && document.querySelector('.sb-child.dragging').dataset.base || 'handbook';
  if (srcBase !== tgtBase) { clearDragStyles(); return; } // no cross-base drops
  if (dragSrcSection !== tgtSection) { clearDragStyles(); return; }
  if (dragSrcItemId === tgtEntryId) { clearDragStyles(); return; }
  // Only allow reordering between true siblings (same parent in the tree).
  if (String(parentOf(dragSrcItemId)) !== String(parentOf(tgtEntryId))) { clearDragStyles(); return; }
  const arr = entriesOf(tgtBase);
  const srcEntry = arr.find(en => en.id === dragSrcItemId);
  const allIdxOfSrc = arr.findIndex(en => en.id === dragSrcItemId);
  if (allIdxOfSrc === -1) { clearDragStyles(); return; }
  arr.splice(allIdxOfSrc, 1);
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  const newTgtIdx = arr.findIndex(en => en.id === tgtEntryId);
  arr.splice(after ? newTgtIdx + 1 : newTgtIdx, 0, srcEntry);
  clearDragStyles();
  saveSidebarOnly();
  renderSidebar();
}

function onDropSI(e) {
  e.preventDefault();
  if (!isAdminMode || dragSrcType !== 'siItem') return;
  const tgtSecId = e.currentTarget.dataset.sectionId;
  const tgtItemId = e.currentTarget.dataset.itemId;
  if (dragSrcItemId === tgtItemId) { clearDragStyles(); return; }
  const srcSec = SIDEBAR_CFG.find(s => s.id === dragSrcSection);
  const tgtSec = SIDEBAR_CFG.find(s => s.id === tgtSecId);
  if (!srcSec || !tgtSec) return;
  const srcIdx = srcSec.items.findIndex(i => i.id === dragSrcItemId);
  const tgtIdx = tgtSec.items.findIndex(i => i.id === tgtItemId);
  if (srcIdx === -1 || tgtIdx === -1) return;
  const [moved] = srcSec.items.splice(srcIdx, 1);
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  const finalIdx = after ? tgtIdx + (srcSec === tgtSec && srcIdx < tgtIdx ? 0 : 1) : tgtIdx;
  tgtSec.items.splice(finalIdx, 0, moved);
  clearDragStyles();
  saveSidebarOnly();
  renderSidebar();
}

/* ══════════════════════════════════════════
   AI SEMANTIC EMBEDDINGS (Transformers.js + MiniLM)
   ──────────────────────────────────────────
   Runs entirely in-browser. The model (~25 MB) loads lazily on first
   semantic search, then is cached by the browser forever. Embeddings
   are quantized to int8 (~384 B/entry) and stored on the entry itself
   as `_emb`, so they ride along through localStorage + Firestore sync.
   ══════════════════════════════════════════ */

// CDN source for the Transformers.js ESM build. Pinned to a major version.
const TRANSFORMERS_CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
const EMBEDDING_MODEL  = 'Xenova/all-MiniLM-L6-v2';

function aiSearchOn() {
  return !!(SITE_SETTINGS && SITE_SETTINGS.aiSearchEnabled !== false) && !EMBEDDER_FAILED;
}
function keywordSearchOn() {
  return !!(SITE_SETTINGS && SITE_SETTINGS.keywordSearchEnabled !== false);
}

// Lazy-load the embedding pipeline. Multiple callers safely share one load.
async function loadEmbedder() {
  if (EMBEDDER) return EMBEDDER;
  if (EMBEDDER_FAILED) return null;
  if (EMBEDDER_LOADING) return EMBEDDER_LOADING;
  EMBEDDER_LOADING = (async () => {
    try {
      // Dynamic ESM import from CDN — first call downloads the wrapper (~few hundred KB),
      // then the model weights (~25 MB) stream in via .pipeline(). Both are HTTP-cached.
      const transformers = await import(/* @vite-ignore */ TRANSFORMERS_CDN + '/dist/transformers.min.js');
      // Disable the local-files-only mode and let it fetch model files from the HF CDN.
      if (transformers.env) {
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
      }
      EMBEDDER = await transformers.pipeline('feature-extraction', EMBEDDING_MODEL, { quantized: true });
      return EMBEDDER;
    } catch (err) {
      console.warn('[AI search] Embedder failed to load — falling back to keyword-only search.', err);
      EMBEDDER_FAILED = true;
      return null;
    } finally {
      EMBEDDER_LOADING = null;
    }
  })();
  return EMBEDDER_LOADING;
}

// Plain-text representation of an entry used as the embedding input.
function entryEmbedSource(entry) {
  const stripped = stripHtml(entry.content || '');
  return [
    entry.title || '',
    entry.section || '',
    (entry.keywords || []).join(' '),
    stripped
  ].filter(Boolean).join(' \n ');
}

// Run the model on a string, return a normalized Float32Array (length 384 for MiniLM).
async function embedText(text) {
  const pipe = await loadEmbedder();
  if (!pipe) return null;
  // pooling:'mean' averages token vectors; normalize:true gives unit-length output so
  // cosine similarity is just a dot product.
  const out = await pipe(text, { pooling: 'mean', normalize: true });
  // `out.data` is a Float32Array view. Copy so it survives outside the tensor's lifetime.
  return new Float32Array(out.data);
}

// Both inputs assumed normalized → cosine similarity = dot product, in [-1, 1].
function cosineSim(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// Int8 quantization: one shared scale per vector. ~4x smaller, <1% quality loss.
function quantizeEmbedding(f32) {
  let max = 0;
  for (let i = 0; i < f32.length; i++) { const v = Math.abs(f32[i]); if (v > max) max = v; }
  if (max === 0) return { s: 0, q: new Array(f32.length).fill(0) };
  const scale = max / 127;
  const q = new Array(f32.length);
  for (let i = 0; i < f32.length; i++) q[i] = Math.max(-127, Math.min(127, Math.round(f32[i] / scale)));
  return { s: scale, q };
}
function dequantizeEmbedding(stored) {
  if (!stored || !Array.isArray(stored.q)) return null;
  const f32 = new Float32Array(stored.q.length);
  const s = stored.s || 0;
  for (let i = 0; i < stored.q.length; i++) f32[i] = stored.q[i] * s;
  return f32;
}

// Cached dequantized view on each entry. Avoids re-allocating a Float32Array per search.
function entryEmbeddingVector(entry) {
  if (!entry || !entry._emb || entry._embV !== EMBED_VERSION) return null;
  if (!entry.__embCache) entry.__embCache = dequantizeEmbedding(entry._emb);
  return entry.__embCache;
}

// Embed an entry and stash the quantized result on it. Used by both
// save-time embedding and the on-load backfill pass.
async function computeEntryEmbedding(entry) {
  const text = entryEmbedSource(entry);
  if (!text.trim()) return false;
  const vec = await embedText(text);
  if (!vec) return false;
  entry._emb = quantizeEmbedding(vec);
  entry._embV = EMBED_VERSION;
  // Invalidate the cached Float32Array so the next search re-reads from the new _emb.
  entry.__embCache = null;
  return true;
}

// Walk every entry across every base and embed the ones that don't yet have a
// current-version embedding. Processes in small batches yielding to the event loop
// so the UI stays responsive. Updates a corner badge with progress.
async function runBackfillEmbeddings() {
  if (BACKFILL_RUNNING) return;
  if (!aiSearchOn()) return;

  const todo = [];
  for (const base of allBaseIds()) {
    for (const e of entriesOf(base)) {
      if (!e._emb || e._embV !== EMBED_VERSION) todo.push(e);
    }
  }
  if (!todo.length) return;

  BACKFILL_RUNNING = true;
  showBackfillIndicator(0, todo.length);
  // Load the model up front so the first item doesn't pay a misleadingly large cost.
  const pipe = await loadEmbedder();
  if (!pipe) { hideBackfillIndicator(); BACKFILL_RUNNING = false; return; }

  const BATCH = 5;
  let done = 0;
  for (let i = 0; i < todo.length; i += BATCH) {
    const batch = todo.slice(i, i + BATCH);
    for (const entry of batch) {
      try { await computeEntryEmbedding(entry); } catch (e) { /* skip bad entries */ }
      done++;
      showBackfillIndicator(done, todo.length);
    }
    // Yield so the page stays interactive between batches.
    await new Promise(r => setTimeout(r, 0));
  }

  // Persist all embeddings (localStorage + Firebase) in one go.
  saveAll('Indexing complete', { silent: true });
  hideBackfillIndicator();
  BACKFILL_RUNNING = false;
}

function showBackfillIndicator(done, total) {
  let el = document.getElementById('ai-index-indicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ai-index-indicator';
    el.innerHTML = '<span class="ai-dot"></span><span class="ai-text"></span>';
    document.body.appendChild(el);
  }
  el.querySelector('.ai-text').textContent = `Indexing for AI search… ${done}/${total}`;
  el.classList.add('visible');
}
function hideBackfillIndicator() {
  const el = document.getElementById('ai-index-indicator');
  if (el) el.classList.remove('visible');
}

// Fire-and-forget embed for a freshly saved entry. Re-checks the entry is still in
// place with the same source text before writing — if the user edited again mid-embed,
// the next attachEmbedding call will handle the new state.
function attachEmbedding(entry, base) {
  if (!aiSearchOn()) return;
  const sourceAtStart = entryEmbedSource(entry);
  computeEntryEmbedding(entry).then(ok => {
    if (!ok) return;
    // Verify the entry still exists in its store and content is unchanged.
    const store = entriesOf(base);
    const live = store && store.find(e => e.id === entry.id);
    if (!live || live !== entry) return; // entry was replaced (re-edited) — leave its newer call to handle it
    if (entryEmbedSource(live) !== sourceAtStart) return; // content drifted — same reasoning
    saveAll('Entry indexed', { silent: true });
  });
}

/* ══════════════════════════════════════════
   SEARCH (synonyms + stemming + bigrams + section fallback)
   ══════════════════════════════════════════ */

// Light Porter-ish stemmer — strips common English suffixes
function stem(word) {
  if (!word || word.length < 4) return word;
  // Order matters: try longer suffixes first
  const rules = [
    [/ies$/, 'y'],     // studies → study
    [/ied$/, 'y'],     // studied → study
    [/tions$/, 'tion'],
    [/ments$/, 'ment'],
    [/(at|bl|iz)e$/, '$1'],  // create → creat
    [/tion$/, 'tion'],  // keep
    [/ment$/, 'ment'],  // keep
    [/sses$/, 'ss'],
    [/ings$/, ''],
    [/ing$/, ''],
    [/edly$/, ''],
    [/ed$/, ''],
    [/ly$/, ''],
    [/ers$/, ''],
    [/er$/, ''],
    [/est$/, ''],
    [/s$/, '']
  ];
  for (const [re, rep] of rules) {
    const m = word.match(re);
    if (m) {
      const next = word.replace(re, rep);
      if (next.length >= 3) return next;
    }
  }
  return word;
}

function tokenize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

// Briefly highlight every occurrence of any query token inside `root`,
// scroll the first hit into view, then auto-remove the highlights so the
// entry returns to its normal styling. Called when an entry is opened
// from a search result so the user can see what part of the article
// matched their query. If no body match is found, falls back to
// flashing the entry title (which is the most likely thing that matched
// when the body has no literal token hit).
function flashSearchMatches(root, query) {
  if (!root || !query) return;
  // Stop-words we never want to flash (would just create noise).
  const STOP = new Set(['the','a','an','and','or','of','to','for','in','on','at','by','is','are','be','this','that','with','as','it']);
  const tokens = tokenize(query).filter(t => t.length >= 2 && !STOP.has(t));
  if (!tokens.length) return;

  // Build a single regex that matches any token (longest first so multi-
  // word phrases or longer terms win over shorter substrings).
  const escaped = tokens
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(' + escaped.join('|') + ')', 'gi');

  // Wrap all matches inside `node`, returning the first <mark> created
  // (or null if nothing matched). Skips <script>/<style>/<mark> and
  // never wraps inside an existing flash mark.
  function wrapMatches(node) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('mark.search-flash')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const targets = [];
    while (walker.nextNode()) targets.push(walker.currentNode);
    let first = null;
    for (const tn of targets) {
      const text = tn.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) continue;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const mark = document.createElement('mark');
        mark.className = 'search-flash';
        mark.textContent = m[0];
        frag.appendChild(mark);
        if (!first) first = mark;
        last = m.index + m[0].length;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    }
    return first;
  }

  let firstMark = wrapMatches(root);

  // No body match? The hit was probably on the title (or a synonym/
  // semantic match). Flash the title element itself instead.
  const titleEl = document.getElementById('ev-title');
  const cleanupRoots = [root];
  if (!firstMark && titleEl) {
    const titleMark = wrapMatches(titleEl);
    if (titleMark) { firstMark = titleMark; cleanupRoots.push(titleEl); }
  }

  if (firstMark) {
    setTimeout(() => {
      try { firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}
    }, 50);
  }

  // Strip the wrappers after the animation finishes. 2.6s gives the
  // 2.4s CSS animation a small grace period.
  setTimeout(() => {
    cleanupRoots.forEach(r => {
      r.querySelectorAll('mark.search-flash').forEach(el => {
        const parent = el.parentNode;
        if (!parent) return;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
        parent.normalize();
      });
    });
  }, 2600);
}

function stemTokens(tokens) { return tokens.map(stem); }

// Build a flat lookup: term → Set of all related terms (by membership in same group)
function buildSynonymIndex() {
  const idx = new Map();
  const groups = Array.isArray(SYNONYMS) ? SYNONYMS : [];
  for (const group of groups) {
    if (!Array.isArray(group) || !group.length) continue;
    const lowerGroup = group.map(g => String(g).toLowerCase().trim()).filter(Boolean);
    for (const term of lowerGroup) {
      if (!idx.has(term)) idx.set(term, new Set());
      for (const other of lowerGroup) {
        if (other !== term) idx.get(term).add(other);
      }
      // Also map the stemmed form
      const st = stem(term);
      if (st !== term) {
        if (!idx.has(st)) idx.set(st, new Set());
        for (const other of lowerGroup) {
          if (other !== term) idx.get(st).add(other);
        }
      }
    }
  }
  // Auto-extend from each entry's own keywords (entry-as-synonym-group)
  for (const entry of HANDBOOK) {
    const titleLower = entry.title.toLowerCase();
    const terms = new Set([titleLower, ...(entry.keywords || []).map(k => k.toLowerCase())]);
    for (const term of terms) {
      if (!term) continue;
      if (!idx.has(term)) idx.set(term, new Set());
      for (const other of terms) {
        if (other !== term) idx.get(term).add(other);
      }
    }
  }
  return idx;
}

// Returns { phrase, tokens, stemmedTokens, expandedPhrases, expandedTokens, bigrams }
function buildQuery(query) {
  const phrase = query.trim().toLowerCase();
  const tokens = tokenize(query);
  const stemmedTokens = stemTokens(tokens);
  const synIdx = buildSynonymIndex();

  // Expand: each token contributes its synonym group
  const expandedPhrases = new Set();
  const expandedTokens = new Set();

  // First, full phrase lookup
  if (synIdx.has(phrase)) {
    for (const t of synIdx.get(phrase)) {
      if (t.includes(' ')) expandedPhrases.add(t);
      else expandedTokens.add(t);
    }
  }
  // Then each individual token
  for (const tok of tokens) {
    if (synIdx.has(tok)) {
      for (const t of synIdx.get(tok)) {
        if (t.includes(' ')) expandedPhrases.add(t);
        else expandedTokens.add(t);
      }
    }
    const st = stem(tok);
    if (st !== tok && synIdx.has(st)) {
      for (const t of synIdx.get(st)) {
        if (t.includes(' ')) expandedPhrases.add(t);
        else expandedTokens.add(t);
      }
    }
  }
  // Bigrams from original tokens
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) bigrams.push(tokens[i] + ' ' + tokens[i+1]);

  return { phrase, tokens, stemmedTokens, expandedPhrases: [...expandedPhrases], expandedTokens: [...expandedTokens], bigrams };
}

// Stem an entry's searchable text once per call
function entrySearchableText(entry) {
  const stripped = entry.content.replace(/<[^>]*>/g, ' ');
  const raw = (entry.title + ' ' + entry.section + ' ' + (entry.keywords||[]).join(' ') + ' ' + stripped).toLowerCase();
  // Stemmed bag of words for stemmed-token matching
  const stemmedSet = new Set(tokenize(raw).map(stem));
  return { raw, stemmedSet };
}

function scoreEntry(entry, q) {
  const title = entry.title.toLowerCase();
  const section = entry.section.toLowerCase();
  const kws = (entry.keywords || []).map(k => k.toLowerCase());
  const kwStr = kws.join(' ');
  const content = entry.content.replace(/<[^>]*>/g, ' ').toLowerCase();
  const stext = entrySearchableText(entry);

  let score = 0;

  // ─── PHRASE / EXACT (highest priority) ───
  if (title === q.phrase) score += 250;
  else if (title.startsWith(q.phrase)) score += 130;
  else if (title.includes(q.phrase)) score += 95;

  if (kws.some(k => k === q.phrase)) score += 140;
  else if (kws.some(k => k.includes(q.phrase))) score += 80;
  else if (kwStr.includes(q.phrase)) score += 55;

  if (section.includes(q.phrase)) score += 45;
  if (content.includes(q.phrase)) score += 18;

  // ─── ORIGINAL TOKENS ───
  const valid = q.tokens.filter(t => t.length >= 2);
  if (valid.length > 1) {
    let kwHits = 0, titleHits = 0;
    for (const t of valid) {
      if (kws.some(k => k.includes(t))) { score += 8; kwHits++; }
      if (title.includes(t)) { score += 6; titleHits++; }
      else if (content.includes(t)) score += 1;
    }
    if (kwHits >= valid.length) score += 25;
    if (titleHits >= valid.length) score += 20;
  } else if (valid.length === 1) {
    const t = valid[0];
    if (kws.some(k => k === t)) score += 14;
    else if (kws.some(k => k.startsWith(t))) score += 8;
    else if (kwStr.includes(t)) score += 4;
    else if (title.includes(t)) score += 10;
    else if (content.includes(t)) score += 1;
  }

  // ─── STEMMED TOKEN MATCHES (catches plural/tense variants) ───
  let stemHits = 0;
  for (const st of q.stemmedTokens) {
    if (st.length >= 3 && stext.stemmedSet.has(st)) stemHits++;
  }
  if (stemHits) score += stemHits * 3;

  // ─── BIGRAM BOOST (adjacent pairs win over scattered tokens) ───
  for (const bg of q.bigrams) {
    if (title.includes(bg)) score += 12;
    else if (kwStr.includes(bg)) score += 8;
    else if (content.includes(bg)) score += 4;
  }

  // ─── SYNONYM / CONCEPT EXPANSIONS (lower weight than originals) ───
  for (const ep of q.expandedPhrases) {
    if (title.includes(ep)) score += 18;
    else if (kwStr.includes(ep)) score += 14;
    else if (content.includes(ep)) score += 6;
  }
  for (const et of q.expandedTokens) {
    if (et.length < 2) continue;
    if (kws.some(k => k === et)) score += 6;
    else if (title.includes(et)) score += 4;
    else if (kwStr.includes(et)) score += 3;
    else if (content.includes(et)) score += 1;
  }

  return score;
}

async function search(query) {
  if (!query || !query.trim()) return [];
  const q = buildQuery(query);

  const kwOn = keywordSearchOn();

  // Semantic side: embed the query if AI search is enabled. Two cases:
  //  • Both modes on (default): if the model isn't loaded yet, kick off the load
  //    in the background and return keyword-only results this round — the user
  //    sees something immediately and gets the full hybrid score next time.
  //  • Keyword off, AI on: we MUST await the model load, because there's no
  //    other path to results. The caller already shows a "loading model" hint.
  let qEmb = null;
  if (aiSearchOn()) {
    if (EMBEDDER) {
      try { qEmb = await embedText(query); } catch (e) { qEmb = null; }
    } else if (!kwOn) {
      try { qEmb = await embedText(query); } catch (e) { qEmb = null; }
    } else {
      loadEmbedder(); // background warmup for the next query
    }
  }
  // Search across all knowledge bases. Tag results with __base.
  const scoredAll = [];
  for (const base of allBaseIds()) {
    const arr = entriesOf(base);
    for (const e of arr) {
      const kwScore = kwOn ? scoreEntry(e, q) : 0;
      let semScore = 0;
      if (qEmb) {
        const eVec = entryEmbeddingVector(e);
        if (eVec) {
          // cosineSim ∈ [-1,1]; scale to a 0–100 range that lives alongside keyword scores.
          // Floor at 0 so dissimilar entries don't actively suppress keyword matches.
          const sim = cosineSim(qEmb, eVec);
          semScore = Math.max(0, sim) * 100;
        }
      }
      // Hybrid: take the stronger signal, then add a small bonus when both agree.
      // This preserves keyword dominance for exact matches (IDs, names) while letting
      // pure-semantic results surface, and rewards entries where both signals point the same way.
      const score = Math.max(kwScore, semScore) + Math.min(kwScore, semScore) * 0.15;
      // Use a slightly higher floor when only the semantic signal contributed —
      // raw similarity will produce small nonzero scores for everything.
      const floor = kwScore > 0 ? 4 : 28;
      if (score >= floor) scoredAll.push({ entry: { ...e, __base: base }, score });
    }
  }

  // Also search Quick Links–style link items (SIDEBAR_CFG). These are links, not
  // content entries, so we score a synthetic entry built from the link text + URL.
  // Quick Links have no content to embed semantically, so they're skipped entirely
  // when keyword search is off.
  if (kwOn) {
    for (const section of (SIDEBAR_CFG || [])) {
      if (!section || !Array.isArray(section.items)) continue;
      for (const item of section.items) {
        if (!item || !item.id || item.visible === false) continue;
        const synthetic = {
          title: item.text || '',
          section: getCategoryLabel(section.id),
          keywords: [],
          content: item.href || ''
        };
        const score = scoreEntry(synthetic, q);
        if (score >= 4) {
          scoredAll.push({
            entry: {
              __link: true,
              sectionId: section.id,
              itemId: item.id,
              id: item.id,
              title: item.text || '(untitled link)',
              href: item.href || null,
              __base: section.id
            },
            score
          });
        }
      }
    }
  }

  scoredAll.sort((a, b) => b.score - a.score);
  let results = scoredAll.map(r => r.entry);

  // ─── SECTION-LEVEL FALLBACK ───
  // Pure keyword path; section descriptions aren't embedded, so skip when kw is off.
  if (kwOn && results.length < 2) {
    const sectionResults = [];
    const scanSections = (arr, base) => {
      for (const sec of arr) {
        const blob = (sec.num + ' ' + sec.title + ' ' + (sec.description || '')).toLowerCase();
        let s = 0;
        if (blob.includes(q.phrase)) s += 80;
        for (const t of q.tokens) if (blob.includes(t)) s += 10;
        for (const ep of q.expandedPhrases) if (blob.includes(ep)) s += 6;
        for (const et of q.expandedTokens) if (blob.includes(et)) s += 3;
        if (s >= 10) sectionResults.push({ entry: { __section: true, __base: base, num: sec.num, title: sec.title, id: sec.num, section: sec.num + '. ' + sec.title, content: sec.description || '' }, score: s });
      }
    };
    scanSections(SECTIONS, 'handbook');
    scanSections(PROJECTS, 'projects');
    for (const cc of (CUSTOM_CATEGORIES || [])) {
      if (cc && Array.isArray(cc.sections)) scanSections(cc.sections, cc.id);
    }
    sectionResults.sort((a, b) => b.score - a.score);
    const haveIds = new Set(results.map(r => r.id + '|' + (r.__base||'handbook')));
    for (const r of sectionResults) {
      const key = r.entry.id + '|' + r.entry.__base;
      if (!haveIds.has(key)) results.push(r.entry);
    }
  }

  return results;
}

function openSearchModal(initialQ) {
  const inp = document.getElementById('search-modal-input');
  if (typeof initialQ === 'string') { inp.value = initialQ; performSearchModal(); }
  else { inp.value = ''; document.getElementById('results-list').innerHTML = ''; document.getElementById('results-count').textContent = ''; }
  document.getElementById('search-modal-overlay').classList.add('open');
  setTimeout(() => inp.focus(), 50);
}
function closeSearchModal() { document.getElementById('search-modal-overlay').classList.remove('open'); }

/* ── MODAL DRAG-OUT GUARD ──
   When you mousedown inside a text input and accidentally drag outside the modal,
   the browser fires `click` on the overlay (the closest common ancestor) which used
   to close the modal and discard your input. We track where mousedown happened and
   only close if BOTH mousedown AND mouseup happened on the overlay itself.
*/
let _overlayMdTarget = null;
document.addEventListener('mousedown', (e) => {
  const t = e.target;
  // Mousedown is "on the overlay" only when the target IS the overlay element itself
  if (t && t.classList && (
    t.classList.contains('admin-modal-overlay') ||
    t.id === 'search-modal-overlay' ||
    t.id === 'lightbox-overlay' ||
    t.id === 'team-modal-overlay' ||
    t.id === 'tm-detail-overlay'
  )) {
    _overlayMdTarget = t.id;
  } else {
    _overlayMdTarget = null;
  }
}, true);

function _shouldCloseOverlay(e, overlayId) {
  // Click target AND prior mousedown target must both be the overlay itself.
  return _overlayMdTarget === overlayId && e.target.id === overlayId;
}

/* ══════════════════════════════════════════
   CUSTOM ALERT / CONFIRM / PROMPT
   Drop-in replacements for window.alert / confirm / prompt with the dashboard's
   own styling. Promise-based so callers do `await customConfirm(...)` instead
   of relying on synchronous browser dialogs. window.alert is overridden below
   so existing fire-and-forget alert() callers continue to work unchanged.
   ══════════════════════════════════════════ */
let _customModalResolver = null;     // active Promise resolve fn
let _customModalKeyHandler = null;   // active document keydown handler

function _customModalResolve(value) {
  // Centralized close: resolves the active Promise with `value`, hides the
  // overlay, and tears down the keyboard handler. value semantics differ per
  // helper — alert always resolves true (no cancel button), confirm resolves
  // true or false, prompt resolves the typed string or null (cancelled).
  const overlay = document.getElementById('custom-modal-overlay');
  const inputEl = document.getElementById('custom-modal-input');
  let resolved = value;
  // Prompt → string-or-null. Anything else → boolean.
  if (overlay && overlay.dataset.kind === 'prompt') {
    if (value === true)       resolved = inputEl ? inputEl.value : '';
    else if (value === null)  resolved = null;
    else                      resolved = value;
  } else {
    resolved = (value === true);
  }
  if (overlay) {
    overlay.classList.remove('open');
    overlay.dataset.kind = '';
  }
  if (_customModalKeyHandler) {
    document.removeEventListener('keydown', _customModalKeyHandler, true);
    _customModalKeyHandler = null;
  }
  const resolver = _customModalResolver;
  _customModalResolver = null;
  if (resolver) resolver(resolved);
}

function _customModalBackdropClick(e) {
  // Treat backdrop-click as cancel only when the click started AND ended on
  // the overlay element (so dragging text inside the modal body doesn't
  // accidentally dismiss). Reuses the same _overlayMdTarget machinery as the
  // other overlays via _shouldCloseOverlay().
  if (_shouldCloseOverlay(e, 'custom-modal-overlay')) _customModalResolve(null);
}

function _openCustomModal(opts) {
  // Resolve any pre-existing modal first so we don't strand a Promise.
  if (_customModalResolver) _customModalResolve(null);
  return new Promise(resolve => {
    _customModalResolver = resolve;
    const overlay   = document.getElementById('custom-modal-overlay');
    const titleEl   = document.getElementById('custom-modal-title');
    const bodyEl    = document.getElementById('custom-modal-message');
    const inputEl   = document.getElementById('custom-modal-input');
    const okBtn     = document.getElementById('custom-modal-ok');
    const cancelBtn = document.getElementById('custom-modal-cancel');

    const kind = opts.kind || 'confirm';   // 'alert' | 'confirm' | 'prompt'
    overlay.dataset.kind = kind;

    // Title — defaults vary by kind. Plain text only.
    const defaultTitle = kind === 'alert' ? 'Notice'
                       : kind === 'prompt' ? 'Enter a value'
                       : 'Confirm';
    titleEl.textContent = opts.title || defaultTitle;

    // Message body. Allow HTML when caller explicitly opts in (e.g. for bold).
    if (opts.html) {
      bodyEl.innerHTML = opts.html;
    } else {
      bodyEl.textContent = opts.message || '';
    }

    // Input field — only visible for prompt.
    if (kind === 'prompt') {
      inputEl.style.display = '';
      inputEl.value = opts.defaultValue != null ? String(opts.defaultValue) : '';
      inputEl.placeholder = opts.placeholder || '';
    } else {
      inputEl.style.display = 'none';
      inputEl.value = '';
    }

    // Buttons — alert is single-button (no Cancel).
    cancelBtn.style.display = kind === 'alert' ? 'none' : '';
    cancelBtn.textContent   = opts.cancelLabel || 'Cancel';
    okBtn.textContent       = opts.confirmLabel || (kind === 'alert' ? 'OK' : kind === 'prompt' ? 'Submit' : 'Confirm');

    // Visual hint for destructive actions — switches OK to red.
    okBtn.classList.remove('btn-primary', 'btn-danger');
    okBtn.classList.add(opts.danger ? 'btn-danger' : 'btn-primary');

    overlay.classList.add('open');
    setTimeout(() => {
      if (kind === 'prompt') { inputEl.focus(); inputEl.select(); }
      else                   { okBtn.focus(); }
    }, 60);

    // Keyboard shortcuts. Use capture phase so we beat the global Esc handler
    // that would otherwise close the next-modal-in-the-list and leave ours up.
    _customModalKeyHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        _customModalResolve(null);
      } else if (e.key === 'Enter' && kind !== 'prompt') {
        // Prompt has its own Enter handler on the input itself.
        if (e.target && e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        _customModalResolve(true);
      }
    };
    document.addEventListener('keydown', _customModalKeyHandler, true);
  });
}

// Public API. Always returns a Promise. Callers can pass either a plain
// message string or an options object as the second arg.
function customAlert(message, opts) {
  return _openCustomModal({ ...(opts || {}), kind: 'alert', message: String(message ?? '') });
}
function customConfirm(message, opts) {
  return _openCustomModal({ ...(opts || {}), kind: 'confirm', message: String(message ?? '') });
}
function customPrompt(message, defaultValue, opts) {
  return _openCustomModal({ ...(opts || {}), kind: 'prompt', message: String(message ?? ''), defaultValue: defaultValue ?? '' });
}

// window.alert override: existing call sites in the dashboard are
// fire-and-forget (they don't read alert()'s return), so we can replace the
// browser dialog with our custom modal transparently. We do NOT override
// window.confirm / window.prompt because those are synchronous and return
// values — replacing them with async Promises would break callers. Those
// call sites are refactored explicitly to use customConfirm / customPrompt.
const _origWindowAlert = window.alert ? window.alert.bind(window) : null;
window.alert = function(msg) {
  try { customAlert(msg); }
  catch(e) { if (_origWindowAlert) _origWindowAlert(msg); }
};

function maybeCloseSearchModal(e) { if (_shouldCloseOverlay(e, 'search-modal-overlay')) closeSearchModal(); }

async function performSearchModal() {
  const q = document.getElementById('search-modal-input').value.trim();
  const list = document.getElementById('results-list');
  const count = document.getElementById('results-count');
  if (!q) { list.innerHTML = ''; count.textContent = ''; return; }
  // First-ever semantic search downloads ~25MB of model — give the user a hint so the wait isn't silent.
  if (aiSearchOn() && !EMBEDDER && !EMBEDDER_FAILED) {
    count.textContent = 'Loading AI model (one-time, ~25MB)…';
    list.innerHTML = '';
  }
  const results = await search(q);
  renderSearchResults(q, results);
}

function runHomeSearch() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) return;
  openSearchModal(q);
}

function chip(q) { openSearchModal(q); }

function renderSearchResults(query, results) {
  const list = document.getElementById('results-list');
  const count = document.getElementById('results-count');

  if (!results.length) {
    count.textContent = '';
    list.innerHTML = `<div class="no-results">No handbook sections matched "<strong>${escapeHtml(query)}</strong>".<br>Try different keywords.</div>`;
    return;
  }

  const tokens = tokenize(query);
  count.textContent = `${results.length} match${results.length !== 1 ? 'es' : ''} found`;

  const top = results.slice(0, 3);
  const others = results.slice(3);

  let html = `<div class="search-segment-label"><span>★ Best Matches</span><span class="segment-line"></span></div>`;
  html += top.map(e => resultCardHtml(e, tokens)).join('');

  if (others.length) {
    html += `<button class="others-toggle" onclick="toggleOthers()">▼ Show ${others.length} other result${others.length !== 1 ? 's' : ''} that could be relevant</button>`;
    html += `<div id="others-section" style="display:none">
      <div class="search-segment-label" style="margin-top:14px"><span>Other Results That Could Be Relevant</span><span class="segment-line"></span></div>
      ${others.map(e => resultCardHtml(e, tokens)).join('')}
    </div>`;
  }

  list.innerHTML = html;
}

function toggleOthers() {
  const sec = document.getElementById('others-section');
  const btn = document.querySelector('.others-toggle');
  const open = sec.style.display !== 'none';
  sec.style.display = open ? 'none' : 'block';
  btn.textContent = open
    ? btn.textContent.replace('▲ Hide', '▼ Show').replace('other results', 'other results that could be relevant')
    : btn.textContent.replace('▼ Show', '▲ Hide').replace(' that could be relevant', '');
}

function resultCardHtml(entry, tokens) {
  const idDisplay = entry.id;
  const base = entry.__base || 'handbook';
  let baseLabel = getCategoryLabel(base).toUpperCase();
  // The original query the user typed (re-derived from the search input
  // so we don't have to thread it through every call site). Used to
  // briefly highlight the matched keywords inside the opened entry.
  const _q = (document.getElementById('search-modal-input') || {}).value || '';
  const qAttr = escJsAttr(_q);  // embedded inside an onclick="...showEntry('…','…','${qAttr}')" JS string — must use the JS-string-safe encoder so apostrophes & other special chars in the user's query don't break the handler

  // Quick-Link result — opens the URL (or shows a "coming soon" note if no URL yet)
  if (entry.__link) {
    const action = entry.href
      ? `<button class="result-go-btn" onclick="closeSearchModal();window.open('${escJsAttr(entry.href)}','_blank','noopener')">Open link ↗</button>`
      : `<span style="font-size:11px;color:var(--mid);font-style:italic">no link yet</span>`;
    return `<div class="result-card">
      <div class="result-card-header">
        <span class="result-section-id">🔗 ${escapeHtml(baseLabel)}</span>
        <span class="result-section-title">${escapeHtml(entry.title)}</span>
        ${action}
      </div>
    </div>`;
  }

  if (entry.__section) {
    return `<div class="result-card">
      <div class="result-card-header">
        <span class="result-section-id">${escapeHtml(baseLabel)} · ${escapeHtml(idDisplay)}</span>
        <span class="result-section-title">${escapeHtml(entry.title)}</span>
        <button class="result-go-btn" onclick="closeSearchModal();showSection('${escJsAttr(entry.num)}','${escJsAttr(base)}')">Open ${base==='projects'?'project':'section'} →</button>
      </div>
    </div>`;
  }
  return `<div class="result-card">
    <div class="result-card-header">
      <span class="result-section-id">${escapeHtml(baseLabel)} · ${escapeHtml(idDisplay)}</span>
      <span class="result-section-title">${escapeHtml(entry.title)}</span>
      <button class="result-edit-btn" onclick="event.stopPropagation();openEntryEditor('${escJsAttr(entry.id)}','${escJsAttr(base)}')">✎ Edit</button>
      <button class="result-go-btn" onclick="closeSearchModal();showEntry('${escJsAttr(entry.id)}','${escJsAttr(base)}','${qAttr}')">Open →</button>
    </div>
  </div>`;
}

// Image size limits
const RT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;   // 2 MB for content images
const AVATAR_MAX_BYTES   = 1 * 1024 * 1024;   // 1 MB for avatars
const AVATAR_MAX_DIM     = 128;               // 128x128 max for avatars

// Convert a File/Blob to a data URL. If the file exceeds maxBytes (and we can't
// fix it by resizing), reject. Returns Promise<string>.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Resize an image to fit within maxDim×maxDim, preserving aspect. Returns data URL.
function resizeImage(dataUrl, maxDim, mime) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w <= maxDim && h <= maxDim) { resolve(dataUrl); return; }
      const scale = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * scale); h = Math.round(h * scale);
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      // Use JPEG if input has no alpha (saves bytes); fall back to PNG
      const out = cv.toDataURL(mime === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
      resolve(out);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/* ════════════════════════════════════════════════════════════════════
   RICH TEXT EDITOR — Tiptap (ProseMirror) engine.
   Real undo/redo history and clean semantic-HTML output that renders in the
   read-only views with no editor runtime. Modules load lazily via loadTiptap().
   ════════════════════════════════════════════════════════════════════ */
const RT_EDITORS = {};
const TIPTAP_VERSION = '2.11.5';
const RT_HL_SWATCHES = [
  { c:'#fff176', t:'Yellow' }, { c:'#aed581', t:'Green' },
  { c:'#80deea', t:'Blue' }, { c:'#f48fb1', t:'Pink' }, { c:'#ffb74d', t:'Orange' }
];
const RT_TT_NAMES = ['core','starter-kit','extension-underline','extension-highlight',
  'extension-link','extension-superscript','extension-subscript','extension-text-align',
  'extension-image','extension-task-list','extension-task-item','extension-placeholder',
  'extension-table','extension-table-row','extension-table-header','extension-table-cell'];
let _tiptapPromise = null;
let _ttImportMapDone = false;

// When the vendored offline bundle is present, register each module as a blob
// URL via an import map under the `tiptapmod:<id>` scheme, so the editor loads
// with zero network (works even from file://).
function _setupOfflineImportMap(bundle) {
  if (_ttImportMapDone) return;
  _ttImportMapDone = true;
  const map = { imports: {} };
  bundle.modules.forEach((code, i) => {
    map.imports['tiptapmod:' + i] = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  });
  const s = document.createElement('script');
  s.type = 'importmap';
  s.textContent = JSON.stringify(map);
  document.head.appendChild(s);
}

// Load all Tiptap modules once — from the offline bundle if available, else CDN.
function loadTiptap() {
  if (_tiptapPromise) return _tiptapPromise;
  const bundle = window.__TIPTAP_BUNDLE;
  let specs;
  if (bundle && bundle.modules && bundle.entries) {
    _setupOfflineImportMap(bundle);
    specs = RT_TT_NAMES.map(n => 'tiptapmod:' + bundle.entries[n]);
  } else {
    const V = TIPTAP_VERSION, base = 'https://esm.sh/@tiptap/';
    specs = RT_TT_NAMES.map(n => base + n + '@' + V);
  }
  _tiptapPromise = Promise.all(specs.map(s => import(s))).then(m => {
    const [core, sk, underline, highlight, link, sup, sub, align, image, taskList, taskItem, placeholder, table, tableRow, tableHeader, tableCell] = m;
    return {
      Editor: core.Editor, Node: core.Node, mergeAttributes: core.mergeAttributes,
      StarterKit: sk.default, Underline: underline.default,
      Highlight: highlight.default, Link: link.default, Superscript: sup.default,
      Subscript: sub.default, TextAlign: align.default, Image: image.default,
      TaskList: taskList.default, TaskItem: taskItem.default, Placeholder: placeholder.default,
      Table: table.default, TableRow: tableRow.default, TableHeader: tableHeader.default, TableCell: tableCell.default
    };
  }).catch(err => { _tiptapPromise = null; throw err; });
  return _tiptapPromise;
}

// Custom extensions built from the loaded Tiptap classes (memoized).
let _rtTableCellExt = null, _rtTableHeaderExt = null, _rtVideoNodeExt = null, _rtImageExt = null;

// Convert an embed src back to a normal "watch" URL for the fallback link.
function _rtVideoWatchUrl(src) {
  let m = (src || '').match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (m) return 'https://www.youtube.com/watch?v=' + m[1];
  m = (src || '').match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (m) return 'https://drive.google.com/file/d/' + m[1] + '/view';
  return src || '#';
}
// A clickable poster shown instead of the iframe when inline playback is blocked
// (e.g. opened from file:// — YouTube/Drive reject embeds with a "config error").
// `asLink` true → a real <a> (read-only views); false → a non-navigating <div> (editor).
function _rtVideoPoster(src, asLink) {
  const isDrive = /drive\.google\.com/.test(src || '');
  const label = (isDrive ? 'Watch on Google Drive' : 'Watch on YouTube') + ' ↗';
  const el = document.createElement(asLink ? 'a' : 'div');
  el.className = 'rt-video-poster';
  if (asLink) { el.href = _rtVideoWatchUrl(src); el.target = '_blank'; el.rel = 'noopener'; }
  el.innerHTML = '<span class="rt-video-play">▶</span><span class="rt-video-label">' + label + '</span>';
  return el;
}
// On file:// only, swap the embedded iframe for a clickable "Watch on YouTube/Drive ↗"
// link (embeds are blocked from a null origin). On http/https videos render normally
// as the saved inline iframe — nothing to do.
function _rtSetupVideoFallback() {
  if (location.protocol !== 'file:') return;
  if (window._rtVideoObs) return;
  const hydrate = root => {
    if (!root || root.nodeType !== 1) return;
    const list = (root.matches && root.matches('.rt-video[data-video-embed]'))
      ? [root] : (root.querySelectorAll ? root.querySelectorAll('.rt-video[data-video-embed]') : []);
    list.forEach(box => {
      if (box.closest('.ProseMirror') || box.dataset.rtHy === '1') return;
      const ifr = box.querySelector('iframe');
      const src = box.getAttribute('data-src') || (ifr ? ifr.getAttribute('src') : '');
      if (!src) return;
      box.dataset.rtHy = '1';
      box.innerHTML = '';
      box.appendChild(_rtVideoPoster(src, true));
    });
  };
  hydrate(document.body);
  const obs = new MutationObserver(muts => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) hydrate(n);
  });
  obs.observe(document.body, { childList: true, subtree: true });
  window._rtVideoObs = obs;
}

// Stop any playing read-only video iframes (set src to about:blank). Called when
// switching to another section/entry so a hidden view's video doesn't keep playing.
// The view rebuilds its content on return, so a fresh iframe appears (ready to play).
function pauseInlineVideos() {
  document.querySelectorAll('.rt-video[data-video-embed] iframe').forEach(ifr => {
    if (ifr.closest('.ProseMirror')) return;   // skip the editor's live preview iframe
    if (ifr.src && ifr.src !== 'about:blank') ifr.src = 'about:blank';
  });
}

// Shared resize NodeView for media (image / video). Aspect ratio is preserved:
// width drives layout, height follows (img height:auto; video box is 16:9).
function _rtMediaNodeView(kind) {
  return ({ node, editor, getPos }) => {
    let current = node;
    const dom = document.createElement(kind === 'img' ? 'span' : 'div');
    dom.className = 'rt-resizable ' + (kind === 'img' ? 'rt-resizable-img' : 'rt-video');
    let media;
    if (kind === 'img') {
      media = document.createElement('img');
      media.src = current.attrs.src || '';
      if (current.attrs.alt) media.alt = current.attrs.alt;
      if (current.attrs.title) media.title = current.attrs.title;
    } else {
      dom.setAttribute('data-video-embed', '');
      dom.setAttribute('data-src', current.attrs.src || '');
      if (location.protocol === 'file:') {
        // Opened as a local file → embeds are blocked; show the clickable poster.
        media = _rtVideoPoster(current.attrs.src, false);
      } else {
        media = document.createElement('iframe');
        media.src = current.attrs.src || '';
        media.setAttribute('frameborder', '0');
        media.setAttribute('allowfullscreen', 'true');
        media.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
      }
    }
    dom.appendChild(media);
    const handle = document.createElement('span');
    handle.className = 'rt-resize-handle';
    handle.title = 'Drag to resize';
    dom.appendChild(handle);
    const applyWidth = w => { dom.style.width = w ? (w + 'px') : ''; };
    applyWidth(current.attrs.width);
    handle.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startX = e.clientX, startW = dom.offsetWidth;
      const maxW = dom.parentElement ? dom.parentElement.clientWidth : 1600;
      const onMove = ev => { let w = startW + (ev.clientX - startX); w = Math.max(48, Math.min(w, maxW)); dom.style.width = Math.round(w) + 'px'; };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        const w = Math.round(dom.offsetWidth);
        if (typeof getPos === 'function') {
          editor.chain().command(({ tr }) => { tr.setNodeMarkup(getPos(), undefined, Object.assign({}, current.attrs, { width: w })); return true; }).run();
        }
      };
      document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
    });
    return {
      dom,
      update(updated) {
        if (updated.type.name !== current.type.name) return false;
        current = updated;
        if (media.tagName === 'IMG' || media.tagName === 'IFRAME') media.src = current.attrs.src || '';
        if (kind === 'video') dom.setAttribute('data-src', current.attrs.src || '');
        applyWidth(current.attrs.width);
        return true;
      },
      ignoreMutation() { return true; }
    };
  };
}
function _rtImage(T) {
  if (_rtImageExt) return _rtImageExt;
  _rtImageExt = T.Image.extend({
    addAttributes() {
      return Object.assign({}, this.parent ? this.parent() : {}, {
        width: {
          default: null,
          parseHTML: el => { const w = el.getAttribute('width') || (el.style.width ? parseInt(el.style.width, 10) : null); return w ? parseInt(w, 10) : null; },
          renderHTML: attrs => attrs.width ? { width: attrs.width, style: `width:${attrs.width}px;height:auto` } : {}
        }
      });
    },
    addNodeView() { return _rtMediaNodeView('img'); }
  });
  return _rtImageExt;
}
function _rtBgAttribute(parentAttrs) {
  return Object.assign({}, parentAttrs, {
    backgroundColor: {
      default: null,
      parseHTML: el => el.style.backgroundColor || null,
      renderHTML: attrs => attrs.backgroundColor ? { style: `background-color:${attrs.backgroundColor}` } : {}
    }
  });
}
function _rtTableCell(T) {
  if (_rtTableCellExt) return _rtTableCellExt;
  _rtTableCellExt = T.TableCell.extend({
    addAttributes() { return _rtBgAttribute(this.parent ? this.parent() : {}); }
  });
  return _rtTableCellExt;
}
function _rtTableHeader(T) {
  if (_rtTableHeaderExt) return _rtTableHeaderExt;
  _rtTableHeaderExt = T.TableHeader.extend({
    addAttributes() { return _rtBgAttribute(this.parent ? this.parent() : {}); }
  });
  return _rtTableHeaderExt;
}
function _rtVideoNode(T) {
  if (_rtVideoNodeExt) return _rtVideoNodeExt;
  _rtVideoNodeExt = T.Node.create({
    name: 'videoEmbed', group: 'block', atom: true, selectable: true, draggable: true,
    addAttributes() {
      return {
        src: { default: null },
        width: {
          default: null,
          parseHTML: el => (el.style && el.style.width ? parseInt(el.style.width, 10) : null) || null,
          renderHTML: attrs => attrs.width ? { style: `width:${attrs.width}px;max-width:${attrs.width}px` } : {}
        }
      };
    },
    parseHTML() { return [{ tag: 'div[data-video-embed]', getAttrs: el => ({ src: el.getAttribute('data-src') || (el.querySelector('iframe') ? el.querySelector('iframe').getAttribute('src') : ''), width: el.style && el.style.width ? parseInt(el.style.width, 10) : null }) }]; },
    renderHTML({ node }) {
      const src = node.attrs.src || '';
      const attrs = { 'data-video-embed': '', 'data-src': src, class: 'rt-video' };
      if (node.attrs.width) attrs.style = `width:${node.attrs.width}px;max-width:${node.attrs.width}px`;
      return ['div', attrs,
        ['iframe', { src, frameborder: '0', allowfullscreen: 'true', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen' }]];
    },
    addNodeView() { return _rtMediaNodeView('video'); },
    addCommands() {
      const name = this.name;
      return { setVideoEmbed: attrs => ({ commands }) => commands.insertContent({ type: name, attrs }) };
    }
  });
  return _rtVideoNodeExt;
}

async function initEditor(editorId, toolbarId, content) {
  const mount = document.getElementById(editorId);
  const toolbar = document.getElementById(toolbarId);
  if (!mount) return;
  if (RT_EDITORS[editorId]) { try { RT_EDITORS[editorId].destroy(); } catch(e){} delete RT_EDITORS[editorId]; }
  mount.removeAttribute('contenteditable');
  mount.innerHTML = '';
  if (toolbar) toolbar.innerHTML = '<span class="rt-loading">Loading editor…</span>';
  let T;
  try { T = await loadTiptap(); }
  catch (e) {
    // Offline with no cached bundle: fall back to a plain editable so content
    // is never lost, even though the rich toolbar is unavailable.
    if (toolbar) toolbar.innerHTML = '<span class="rt-loading">Rich editor unavailable offline — plain text only.</span>';
    mount.setAttribute('contenteditable','true');
    mount.classList.add('rt-prose');
    mount.innerHTML = content || '';
    return;
  }
  if (!document.body.contains(mount)) return;   // modal closed while loading
  const placeholder = mount.getAttribute('data-placeholder') || 'Write here…';
  const editor = new T.Editor({
    element: mount,
    extensions: [
      T.StarterKit.configure({ heading: { levels: [1,2,3,4] } }),
      T.Underline,
      T.Highlight.configure({ multicolor: true }),
      T.Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { target:'_blank', rel:'noopener nofollow' } }),
      T.Superscript, T.Subscript,
      T.TextAlign.configure({ types: ['heading','paragraph'] }),
      _rtImage(T).configure({ inline: false, allowBase64: true }),
      T.TaskList, T.TaskItem.configure({ nested: true }),
      T.Table.configure({ resizable: true, lastColumnResizable: true, allowTableNodeSelection: true }),
      T.TableRow, _rtTableHeader(T), _rtTableCell(T),
      _rtVideoNode(T),
      T.Placeholder.configure({ placeholder })
    ],
    content: content || '',
    editorProps: {
      attributes: { class: 'rt-prose' },
      handlePaste: (view, event) => rtHandleImagePaste(editorId, event)
    },
    onSelectionUpdate: () => rtUpdateToolbar(editorId),
    onTransaction: () => rtUpdateToolbar(editorId)
  });
  RT_EDITORS[editorId] = editor;
  rtBuildToolbar(toolbarId, editorId);
  rtUpdateToolbar(editorId);
}

// Read an editor's HTML for saving. Treats Tiptap's empty doc as empty string.
function getEditorHTML(editorId) {
  const e = RT_EDITORS[editorId];
  if (e) { const html = e.getHTML(); return html === '<p></p>' ? '' : html; }
  const el = document.getElementById(editorId);
  return el ? el.innerHTML : '';
}

/* ── Command dispatch ── */
function rtCmd(editorId, action, arg) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const c = e.chain().focus();
  switch (action) {
    case 'bold': c.toggleBold().run(); break;
    case 'italic': c.toggleItalic().run(); break;
    case 'underline': c.toggleUnderline().run(); break;
    case 'strike': c.toggleStrike().run(); break;
    case 'sup': c.toggleSuperscript().run(); break;
    case 'sub': c.toggleSubscript().run(); break;
    case 'bullet': c.toggleBulletList().run(); break;
    case 'ordered': c.toggleOrderedList().run(); break;
    case 'task': c.toggleTaskList().run(); break;
    case 'blockquote': c.toggleBlockquote().run(); break;
    case 'codeblock': c.toggleCodeBlock().run(); break;
    case 'align': c.setTextAlign(arg).run(); break;
    case 'highlight': c.toggleHighlight({ color: arg }).run(); break;
    case 'unhighlight': c.unsetHighlight().run(); break;
    case 'undo': c.undo().run(); break;
    case 'redo': c.redo().run(); break;
    case 'clear': c.unsetAllMarks().clearNodes().run(); break;
  }
  rtUpdateToolbar(editorId);
}
function rtSetHeading(editorId, level) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const c = e.chain().focus();
  if (!level || level === '0') c.setParagraph().run();
  else c.toggleHeading({ level: parseInt(level, 10) }).run();
  rtUpdateToolbar(editorId);
}
async function rtSetLink(editorId) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const prev = e.getAttributes('link').href || '';
  const url = await customPrompt('Link URL (leave empty to remove the link):', prev || 'https://', {
    title: 'Insert / edit link', placeholder: 'https://…', confirmLabel: 'Apply link'
  });
  if (url === null) return;
  if (url.trim() === '') e.chain().focus().extendMarkRange('link').unsetLink().run();
  else e.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  rtUpdateToolbar(editorId);
}
function rtPickImage(editorId) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async ev => {
    const file = ev.target.files[0]; if (!file) return;
    if (file.size > RT_IMAGE_MAX_BYTES) { alert(`Image is too large (${(file.size/1024/1024).toFixed(2)} MB). Maximum is 2 MB.`); return; }
    try { const url = await fileToDataUrl(file); const e = RT_EDITORS[editorId]; if (e) e.chain().focus().setImage({ src: url }).run(); }
    catch (err) { alert('Could not read image: ' + err.message); }
  };
  inp.click();
}
// Paste image → insert as data URL. Returns true when it handled the paste.
function rtHandleImagePaste(editorId, event) {
  const items = event.clipboardData && event.clipboardData.items;
  if (!items) return false;
  for (const it of items) {
    if (it.type && it.type.startsWith('image/')) {
      const blob = it.getAsFile();
      if (!blob) continue;
      if (blob.size > RT_IMAGE_MAX_BYTES) { alert('Pasted image is too large (max 2 MB).'); return true; }
      fileToDataUrl(blob).then(url => { const e = RT_EDITORS[editorId]; if (e) e.chain().focus().setImage({ src: url }).run(); });
      return true;
    }
  }
  return false;
}

/* ── Toolbar dropdown menus (Table) ── */
function rtToggleMenu(btn) {
  const menu = btn.closest('.rt-menu');
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.rt-menu.open').forEach(m => m.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
  if (!window._rtMenuCloser) {
    window._rtMenuCloser = true;
    document.addEventListener('mousedown', ev => { if (!ev.target.closest('.rt-menu')) document.querySelectorAll('.rt-menu.open').forEach(m => m.classList.remove('open')); });
  }
}

/* ── Tables ── */
// Number of columns in the row containing the current selection (for the 6-col cap).
function _rtColCount(e) {
  try {
    const dom = e.view.domAtPos(e.state.selection.from);
    let n = dom.node; if (n && n.nodeType === 3) n = n.parentNode;
    const cell = n && n.closest ? n.closest('td,th') : null;
    return cell && cell.parentNode ? cell.parentNode.children.length : 0;
  } catch (err) { return 0; }
}
function rtTable(editorId, op) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const c = e.chain().focus();
  switch (op) {
    case 'insert': c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break;
    case 'rowAfter': c.addRowAfter().run(); break;
    case 'rowBefore': c.addRowBefore().run(); break;
    case 'colAfter': if (_rtColCount(e) >= 6) { showToast('Tables are limited to 6 columns.'); break; } c.addColumnAfter().run(); break;
    case 'colBefore': if (_rtColCount(e) >= 6) { showToast('Tables are limited to 6 columns.'); break; } c.addColumnBefore().run(); break;
    case 'delRow': c.deleteRow().run(); break;
    case 'delCol': c.deleteColumn().run(); break;
    case 'toggleHeaderRow': c.toggleHeaderRow().run(); break;
    case 'merge': c.mergeCells().run(); break;
    case 'split': c.splitCell().run(); break;
    case 'clearCellColor': c.setCellAttribute('backgroundColor', null).run(); break;
    case 'delTable': c.deleteTable().run(); break;
  }
  document.querySelectorAll('.rt-menu.open').forEach(m => m.classList.remove('open'));
  rtUpdateToolbar(editorId);
}
function rtTableCellColor(editorId, color) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  e.chain().focus().setCellAttribute('backgroundColor', color || null).run();
}

/* ── Video embeds (YouTube + Google Drive → responsive iframe) ── */
function _rtVideoEmbedSrc(url) {
  url = (url || '').trim(); if (!url) return null;
  let m;
  // YouTube: watch?v=, youtu.be/, /embed/, /shorts/
  m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  // Google Drive: /file/d/ID/... or ?id=ID
  m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([A-Za-z0-9_-]{10,})/);
  if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
  return null;
}
async function rtInsertVideo(editorId) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const url = await customPrompt('Paste a YouTube or Google Drive link:', '', {
    title: 'Embed video', placeholder: 'https://youtu.be/… or https://drive.google.com/…', confirmLabel: 'Embed'
  });
  if (url === null) return;
  const src = _rtVideoEmbedSrc(url);
  if (!src) { alert('Could not recognize that as a YouTube or Google Drive video link.'); return; }
  e.chain().focus().setVideoEmbed({ src }).run();
}

/* ── Toolbar ── */
function rtBtn(editorId, action, label, title, arg) {
  const ed = escAttr(editorId);
  const argCall = arg !== undefined ? `,'${escJsAttr(arg)}'` : '';
  const argAttr = arg !== undefined ? ` data-arg="${escAttr(arg)}"` : '';
  return `<button class="rt-btn" type="button" data-act="${escAttr(action)}"${argAttr} title="${escAttr(title)}" onmousedown="event.preventDefault()" onclick="rtCmd('${ed}','${escJsAttr(action)}'${argCall})">${label}</button>`;
}
function rtBuildToolbar(toolbarId, editorId) {
  const ed = escAttr(editorId);
  const sep = '<div class="rt-sep"></div>';
  const headingSel = `<select class="rt-select" title="Paragraph style" onchange="rtSetHeading('${ed}', this.value)">
    <option value="0">Normal</option>
    <option value="1">Heading 1</option>
    <option value="2">Heading 2</option>
    <option value="3">Heading 3</option>
    <option value="4">Heading 4</option>
  </select>`;
  const hl = `<span class="rt-hl-group"><span class="rt-hl-icon" title="Highlight">🖍</span>` +
    RT_HL_SWATCHES.map(h => `<button class="rt-hl-swatch" type="button" title="Highlight ${h.t}" style="background:${h.c}" onmousedown="event.preventDefault()" onclick="rtCmd('${ed}','highlight','${h.c}')"></button>`).join('') +
    `<button class="rt-btn" type="button" title="Remove highlight" onmousedown="event.preventDefault()" onclick="rtCmd('${ed}','unhighlight')">✕</button></span>`;
  const mi = (op, label) => `<button class="rt-menu-item" type="button" onmousedown="event.preventDefault()" onclick="rtTable('${ed}','${op}')">${label}</button>`;
  const tableMenu = `<span class="rt-menu">
    <button class="rt-btn" type="button" title="Table" onmousedown="event.preventDefault()" onclick="rtToggleMenu(this)">▦ ▾</button>
    <div class="rt-menu-panel">
      ${mi('insert','▦  Insert table')}
      <div class="rt-menu-sep"></div>
      ${mi('rowAfter','＋ Row below')}${mi('rowBefore','＋ Row above')}
      ${mi('colAfter','＋ Column right')}${mi('colBefore','＋ Column left')}
      ${mi('delRow','−  Delete row')}${mi('delCol','−  Delete column')}
      <div class="rt-menu-sep"></div>
      ${mi('toggleHeaderRow','Toggle header row')}
      ${mi('merge','Merge cells')}${mi('split','Split cell')}
      <label class="rt-menu-item" onmousedown="event.preventDefault()">🎨 Cell color <input type="color" class="rt-cell-color" oninput="rtTableCellColor('${ed}', this.value)"></label>
      ${mi('clearCellColor','Clear cell color')}
      <div class="rt-menu-sep"></div>
      <button class="rt-menu-item rt-menu-danger" type="button" onmousedown="event.preventDefault()" onclick="rtTable('${ed}','delTable')">🗑 Delete table</button>
    </div>
  </span>`;
  const html =
    rtBtn(editorId,'undo','↶','Undo (Ctrl+Z)') +
    rtBtn(editorId,'redo','↷','Redo (Ctrl+Y)') + sep +
    headingSel + sep +
    rtBtn(editorId,'bold','<b>B</b>','Bold (Ctrl+B)') +
    rtBtn(editorId,'italic','<i>I</i>','Italic (Ctrl+I)') +
    rtBtn(editorId,'underline','<u>U</u>','Underline (Ctrl+U)') +
    rtBtn(editorId,'strike','<s>S</s>','Strikethrough') +
    rtBtn(editorId,'sup','x<sup>2</sup>','Superscript') +
    rtBtn(editorId,'sub','x<sub>2</sub>','Subscript') + sep +
    hl + sep +
    `<button class="rt-btn" type="button" data-act="link" title="Insert / edit link" onmousedown="event.preventDefault()" onclick="rtSetLink('${ed}')">🔗</button>` + sep +
    rtBtn(editorId,'bullet','• List','Bullet list') +
    rtBtn(editorId,'ordered','1. List','Numbered list') +
    rtBtn(editorId,'task','☑','Task list') + sep +
    rtBtn(editorId,'blockquote','❝','Blockquote') +
    rtBtn(editorId,'codeblock','&lt;/&gt;','Code block') + sep +
    rtBtn(editorId,'align','⇤','Align left','left') +
    rtBtn(editorId,'align','≡','Align center','center') +
    rtBtn(editorId,'align','⇥','Align right','right') +
    rtBtn(editorId,'align','☰','Justify','justify') + sep +
    `<button class="rt-btn" type="button" title="Insert image (or paste from clipboard)" onmousedown="event.preventDefault()" onclick="rtPickImage('${ed}')">🖼</button>` +
    `<button class="rt-btn" type="button" title="Embed a YouTube or Google Drive video" onmousedown="event.preventDefault()" onclick="rtInsertVideo('${ed}')">▶</button>` +
    tableMenu + sep +
    rtBtn(editorId,'clear','⌫','Clear formatting');
  const tb = document.getElementById(toolbarId);
  if (tb) tb.innerHTML = html;
}
function rtUpdateToolbar(editorId) {
  const e = RT_EDITORS[editorId]; if (!e) return;
  const mount = document.getElementById(editorId);
  const tb = mount && mount.parentElement ? mount.parentElement.querySelector('.rt-toolbar') : null;
  if (!tb) return;
  const state = {
    bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline'),
    strike: e.isActive('strike'), sup: e.isActive('superscript'), sub: e.isActive('subscript'),
    bullet: e.isActive('bulletList'), ordered: e.isActive('orderedList'), task: e.isActive('taskList'),
    blockquote: e.isActive('blockquote'), codeblock: e.isActive('codeBlock'), link: e.isActive('link')
  };
  tb.querySelectorAll('.rt-btn[data-act]').forEach(btn => {
    const act = btn.dataset.act;
    if (act === 'align') btn.classList.toggle('active', e.isActive({ textAlign: btn.dataset.arg }));
    else if (act === 'undo') btn.disabled = !e.can().undo();
    else if (act === 'redo') btn.disabled = !e.can().redo();
    else if (act in state) btn.classList.toggle('active', !!state[act]);
  });
  const sel = tb.querySelector('.rt-select');
  if (sel) {
    let v = '0';
    for (let lvl = 1; lvl <= 4; lvl++) if (e.isActive('heading', { level: lvl })) { v = String(lvl); break; }
    sel.value = v;
  }
}

/* ══════════════════════════════════════════
   ADMIN AUTH
   ══════════════════════════════════════════ */
const ADMIN_PW = 'VLMCS123';
function openAdminAuth() {
  if (isAdminMode) { exitAdminMode(); return; }
  document.getElementById('pwd-input').value = '';
  document.getElementById('pwd-error').textContent = '';
  document.getElementById('pwd-input').classList.remove('error');
  document.getElementById('pwd-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('pwd-input').focus(), 60);
}
function closePwdModal() { document.getElementById('pwd-modal-overlay').classList.remove('open'); }
function maybeClosePwd(e) { if (_shouldCloseOverlay(e, 'pwd-modal-overlay')) closePwdModal(); }
function checkPassword() {
  if (document.getElementById('pwd-input').value === ADMIN_PW) {
    closePwdModal(); enterAdminMode();
  } else {
    document.getElementById('pwd-error').textContent = 'Incorrect password.';
    const inp = document.getElementById('pwd-input');
    inp.classList.add('error'); inp.value = '';
    setTimeout(() => inp.classList.remove('error'), 400);
    inp.focus();
  }
}
function _swapAdminIcons(adminOn) {
  const locked = document.getElementById('admin-icon-locked');
  const unlocked = document.getElementById('admin-icon-unlocked');
  if (locked) locked.style.display = adminOn ? 'none' : '';
  if (unlocked) unlocked.style.display = adminOn ? '' : 'none';
  const btn = document.getElementById('admin-btn');
  if (btn) btn.title = adminOn ? 'Admin Mode active — click to exit' : 'Admin Mode';
}
function enterAdminMode() {
  isAdminMode = true;
  document.body.classList.add('admin-mode');
  _swapAdminIcons(true);
  renderSidebar(); renderAnnouncements();
  showToast('Admin mode active');
}
function exitAdminMode() {
  isAdminMode = false;
  document.body.classList.remove('admin-mode');
  _swapAdminIcons(false);
  if (currentView === 'docview') showHome();
  renderSidebar(); renderAnnouncements();
  showToast('Admin mode exited');
}

/* ══════════════════════════════════════════
   LOGIN / CURRENT USER
   The dashboard sits behind a passkey login. Each TEAM_DIRECTORY member has a
   unique 8-char passkey (auto-generated on profile creation). Entering that
   passkey at the login screen identifies that person as `currentUser` — they
   can then edit their own profile and (in the future) view information that
   only they should see. The admin password (ADMIN_PW) also bypasses login but
   without attaching a specific identity; it just turns Admin Mode on.
   ══════════════════════════════════════════ */
function _findMemberByPasskey(code) {
  if (!code) return null;
  const norm = String(code).trim().toUpperCase();
  if (!norm) return null;
  return (TEAM_DIRECTORY || []).find(m => m && m.passkey && String(m.passkey).toUpperCase() === norm) || null;
}

function setCurrentUser(member, remember) {
  currentUser = member ? {
    tmId: member.id,
    slackName: member.slackName || '',
    passkey: member.passkey || ''
  } : null;
  currentUserPersistent = !!remember;
  const payload = currentUser ? JSON.stringify(currentUser) : '';
  // Always clear any legacy localStorage copy so older "remember on this
  // device" data doesn't shadow the new session-scoped storage.
  try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
  try {
    if (remember && payload) sessionStorage.setItem(LOGIN_KEY, payload);
    else                     sessionStorage.removeItem(LOGIN_KEY);
  } catch(e){}
}

function loadCurrentUser() {
  // Session-scoped: read from sessionStorage only. (Closing the browser ends
  // the session — same-tab refresh keeps it.) Legacy migration: if an older
  // build stashed creds in localStorage, fold them forward into sessionStorage
  // ONCE so the existing user isn't bounced back to login on this load.
  let raw = '';
  try { raw = sessionStorage.getItem(LOGIN_KEY) || ''; } catch(e){}
  if (!raw) {
    try {
      const legacy = localStorage.getItem(LOGIN_KEY);
      if (legacy) {
        raw = legacy;
        try { sessionStorage.setItem(LOGIN_KEY, legacy); } catch(e){}
        try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
      }
    } catch(e){}
  }
  if (!raw) return null;
  let stored = null;
  try { stored = JSON.parse(raw); } catch(e){ return null; }
  if (!stored || !stored.tmId) return null;
  // Validate against TEAM_DIRECTORY: if the member was deleted OR their passkey
  // was rotated (by an admin), the stored creds no longer count — re-prompt.
  const member = (TEAM_DIRECTORY || []).find(m => m && m.id === stored.tmId);
  if (!member) return null;
  if (!member.passkey || String(member.passkey).toUpperCase() !== String(stored.passkey || '').toUpperCase()) return null;
  currentUser = { tmId: member.id, slackName: member.slackName || '', passkey: member.passkey };
  currentUserPersistent = true;
  return currentUser;
}

function signOut() {
  currentUser = null;
  currentUserPersistent = false;
  try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
  try { sessionStorage.removeItem(LOGIN_KEY); } catch(e){}
  // Also exit admin mode on sign-out (clean slate) and reload to surface the
  // login screen, which is the cleanest way to reset all view state.
  if (isAdminMode) { isAdminMode = false; document.body.classList.remove('admin-mode'); }
  location.reload();
}

// True if the currently logged-in identity owns this team member profile.
function isOwnerOfProfile(m) {
  return !!(currentUser && m && currentUser.tmId === m.id);
}

/* ══════════════════════════════════════════
   ENTRY EDITOR
   ══════════════════════════════════════════ */
function populateSectionSelect(selectedNum, base) {
  base = base || 'handbook';
  const sel = document.getElementById('ef-section-select');
  const list = sectionsOf(base);
  sel.innerHTML = list.map(s => `<option value="${escAttr(s.num)}">${escapeHtml(s.num + '. ' + s.title)}</option>`).join('')
                + `<option value="__new__">＋ New ${base === 'projects' ? 'project' : 'section'}…</option>`;
  if (selectedNum) sel.value = String(selectedNum);
  onSectionSelectChange();
}

function onSectionSelectChange() {
  const sel = document.getElementById('ef-section-select');
  document.getElementById('ef-new-section-group').style.display = (sel.value === '__new__') ? '' : 'none';
  // Entry IDs are assigned automatically on save — nothing to compute here.
}

function openEntryEditor(id, base) {
  base = base || 'handbook';
  if (!findEntry(id, base)) {
    const found = findEntryAnywhere(id);
    if (found) base = found.base;
  }
  const sectionNum = sectionNumOf(id);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to edit handbook entries.');
    return;
  }
  const entry = findEntry(id, base);
  if (!entry) return;
  editEntryId = id;
  editEntryPresetId = null;
  editEntryBase = base;
  editEntrySrcSection = sectionNumOf(id);
  document.getElementById('entry-modal-title-text').textContent = base === 'projects' ? 'Edit Project Entry' : 'Edit Entry';
  document.getElementById('delete-entry-btn').style.display = '';
  populateSectionSelect(sectionNumOf(id), base);
  // Editing keeps the entry where it is — the section/ID are fixed.
  document.getElementById('ef-section-field').style.display = 'none';
  document.getElementById('ef-new-section-group').style.display = 'none';
  document.getElementById('ef-title').value = entry.title;
  document.getElementById('ef-keywords').value = (entry.keywords || []).join(', ');
  initEditor('ef-content-editor', 'ef-rt-toolbar', entry.content);
  document.getElementById('entry-modal-overlay').classList.add('open');
}

function openNewEntryEditor(sectionNum, base, presetId) {
  base = base || 'handbook';
  if (sectionNum && !canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to add entries.');
    return;
  }
  editEntryId = null;
  editEntryPresetId = presetId || null;   // for a sub-entry, the parent fixes the (auto) ID
  editEntryBase = base;
  editEntrySrcSection = null;
  const isSub = presetId && idComponents(presetId).length > 2;
  document.getElementById('entry-modal-title-text').textContent =
    isSub ? 'New Sub-Entry' : (base === 'projects' ? 'New Project Entry' : 'New Entry');
  document.getElementById('delete-entry-btn').style.display = 'none';
  const firstSec = sectionsOf(base)[0];
  populateSectionSelect(sectionNum || (firstSec && firstSec.num), base);
  // Sub-entries belong to a fixed parent → hide the section picker; top-level new entries keep it.
  document.getElementById('ef-section-field').style.display = isSub ? 'none' : '';
  document.getElementById('ef-title').value = '';
  document.getElementById('ef-keywords').value = '';
  initEditor('ef-content-editor', 'ef-rt-toolbar', '');
  document.getElementById('ef-new-section-title').value = '';
  document.getElementById('entry-modal-overlay').classList.add('open');
}

function closeEntryModal() { document.getElementById('entry-modal-overlay').classList.remove('open'); }
function maybeCloseEntry(e) { if (_shouldCloseOverlay(e, 'entry-modal-overlay')) closeEntryModal(); }

function saveEntry() {
  const base = editEntryBase || 'handbook';
  const sel = document.getElementById('ef-section-select');
  let sectionNum = sel.value;
  let sectionTitle = null;

  if (sectionNum === '__new__') {
    sectionTitle = document.getElementById('ef-new-section-title').value.trim();
    if (!sectionTitle) { alert(`Please enter the new ${base==='projects'?'project':'section'} title.`); return; }
    // Section number is auto-assigned (next available).
    const nums = sectionsOf(base).map(s => parseInt(s.num)).filter(n => !isNaN(n));
    sectionNum = String(nums.length ? Math.max(...nums) + 1 : 1);
    const ns = { num: sectionNum, title: sectionTitle, description: '' };
    if (base === 'projects') ns.passkey = generatePasskey();
    sectionsOf(base).push(ns);
  }

  const title = document.getElementById('ef-title').value.trim();
  const kwRaw = document.getElementById('ef-keywords').value.trim();
  const content = getEditorHTML('ef-content-editor');

  if (!title) { alert('Title is required.'); return; }
  if (!stripHtml(content)) { alert('Entry content cannot be empty.'); return; }

  // IDs are auto-assigned: editing keeps the existing id; a new sub-entry uses
  // its preset (parent-derived) id; a new top-level entry gets next "<section>.<n>".
  let id;
  if (editEntryId) id = editEntryId;
  else if (editEntryPresetId) id = editEntryPresetId;
  else {
    const existing = entriesInSection(sectionNum, base).map(e => e.id);
    let n = 1; while (existing.includes(`${sectionNum}.${n}`)) n++;
    id = `${sectionNum}.${n}`;
  }

  const sec = findSection(sectionNum, base);
  const sectionLabel = sec ? `${sec.num}. ${sec.title}` : sectionNum;
  const keywords = kwRaw.split(',').map(k => k.trim()).filter(Boolean);
  const store = entriesOf(base);

  let savedEntry;
  if (editEntryId) {
    const idx = store.findIndex(e => e.id === editEntryId);
    if (idx === -1) { alert('Entry not found.'); return; }
    if (id !== editEntryId && store.some(e => e.id === id)) {
      alert(`An entry with ID "${id}" already exists.`); return;
    }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store[idx] = savedEntry;
    if (currentEntryId === editEntryId && currentBase === base) currentEntryId = id;
  } else {
    if (store.some(e => e.id === id)) { alert(`An entry with ID "${id}" already exists.`); return; }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store.push(savedEntry);
  }

  closeEntryModal();
  saveAll('Entry saved');
  // Embed in background; a second silent saveAll persists the embedding when ready.
  attachEmbedding(savedEntry, base);
  renderSidebar();
  if (currentView === 'entry' && currentEntryId === id && currentBase === base) showEntry(id, base);
  else if (currentView === 'section' && currentBase === base) showSection(currentSectionNum, base);
  else if (currentView === 'docview') renderDocView();
}

async function deleteCurrentEntry() {
  if (!editEntryId) return;
  const base = editEntryBase || 'handbook';
  const descCount = descendantsOf(editEntryId, base).length;
  const msg = descCount
    ? `Delete this entry AND its ${descCount} nested sub-${descCount===1?'entry':'entries'}? This cannot be undone.`
    : 'Delete this entry permanently?';
  if (!await customConfirm(msg, { danger: true, confirmLabel: 'Delete entry' })) return;
  // Remove the entry and every descendant (ids starting with "<id>.")
  const prefix = editEntryId + '.';
  const keep = e => e.id !== editEntryId && !e.id.startsWith(prefix);
  if (base === 'projects') PROJECT_ENTRIES = PROJECT_ENTRIES.filter(keep);
  else if (base === 'handbook') HANDBOOK = HANDBOOK.filter(keep);
  else {
    const cc = CUSTOM_CATEGORIES.find(c => c.id === base);
    if (cc) cc.entries = cc.entries.filter(keep);
  }
  const deletedId = editEntryId;
  closeEntryModal();
  saveAll('Entry deleted');
  if (currentBase === base && (currentEntryId === deletedId || String(currentEntryId).startsWith(prefix))) {
    // We were viewing the deleted entry (or one of its descendants) — go to its parent
    const pid = parentOf(deletedId);
    if (pid && findEntry(pid, base)) showEntry(pid, base);
    else if (currentSectionNum) showSection(currentSectionNum, base);
    else showHome();
  }
  renderSidebar();
  if (currentView === 'docview') renderDocView();
}

/* ══════════════════════════════════════════
   SECTION EDITOR
   ══════════════════════════════════════════ */
function openSectionEditor(num, base) {
  base = base || 'handbook';
  const sec = findSection(num, base);
  if (!sec) return;
  // Access check: real admin OR a passkey-unlocked project section.
  if (!isAdminMode && !(base === 'projects' && unlockedProjects.has(String(num)))) {
    if (base === 'projects') promptUnlockProjectSection(num);
    else alert('Admin Mode required to edit section info.');
    return;
  }
  editSectionNum = num;
  editSectionBase = base;
  document.getElementById('section-modal-title-text').textContent = base === 'projects' ? 'Edit Project' : 'Edit Section';
  // Delete is admin-only — passkey-unlocked users cannot delete the section.
  document.getElementById('delete-section-btn').style.display = isAdminMode ? '' : 'none';
  document.getElementById('sef-title').value = sec.title;
  initEditor('sef-desc-editor', 'sef-rt-toolbar', sec.description || '');
  // Passkey row is real-admin only (an unlocked user shouldn't be able to view/change it).
  const showPasskey = (base === 'projects') && isAdminMode;
  document.getElementById('sef-passkey-row').style.display = showPasskey ? '' : 'none';
  if (showPasskey) {
    if (!sec.passkey) sec.passkey = generatePasskey();
    document.getElementById('sef-passkey').value = sec.passkey;
  }
  document.getElementById('section-modal-overlay').classList.add('open');
}
function openNewSectionEditor(base) {
  base = base || 'handbook';
  editSectionNum = null;
  editSectionBase = base;
  document.getElementById('section-modal-title-text').textContent = base === 'projects' ? 'New Project' : 'New Section';
  document.getElementById('delete-section-btn').style.display = 'none';
  document.getElementById('sef-title').value = '';
  initEditor('sef-desc-editor', 'sef-rt-toolbar', '');
  // Show passkey preview for new project sections (will be saved on Save)
  const showPasskey = (base === 'projects') && isAdminMode;
  document.getElementById('sef-passkey-row').style.display = showPasskey ? '' : 'none';
  if (showPasskey) {
    document.getElementById('sef-passkey').value = generatePasskey();
  }
  document.getElementById('section-modal-overlay').classList.add('open');
}

function generatePasskey() {
  // 8-char alphanumeric, easy to read (no 0/O/1/I/l)
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

// True if the user can edit entries within (base, sectionNum):
//   - Admin can always edit anything.
//   - For Projects: non-admin needs to have unlocked the section's passkey.
//   - For Handbook / custom: only admin (no passkey system).
function canEditSection(base, sectionNum) {
  if (isAdminMode) return true;
  if (base === 'projects') return unlockedProjects.has(String(sectionNum));
  return false;
}

function _saveUnlocks() {
  try { sessionStorage.setItem('vl_unlocked', JSON.stringify([...unlockedProjects])); } catch(e){}
}

async function promptUnlockProjectSection(num) {
  const sec = findSection(num, 'projects');
  if (!sec) return;
  if (!sec.passkey) {
    if (await customConfirm(`Project "${sec.title}" has no passkey set. Only admins can edit it. Continue to Section view?`, { confirmLabel: 'Continue' })) {
      showSection(num, 'projects');
    }
    return;
  }
  const entered = await customPrompt(`Enter the edit passkey for "${sec.num}. ${sec.title}":`, '', {
    title: 'Unlock project section', placeholder: 'Passkey', confirmLabel: 'Unlock'
  });
  if (entered === null) return;
  if (entered.trim().toUpperCase() === sec.passkey.toUpperCase()) {
    unlockedProjects.add(String(num));
    _saveUnlocks();
    renderSidebar();
    if (currentView === 'section' && currentBase === 'projects' && currentSectionNum === String(num)) showSection(num, 'projects');
    showToast(`🔓 Edit access granted for "${sec.title}"`);
  } else {
    alert('Incorrect passkey.');
  }
}

function lockProjectSection(num) {
  unlockedProjects.delete(String(num));
  _saveUnlocks();
  renderSidebar();
  if (currentView === 'section' && currentBase === 'projects' && currentSectionNum === String(num)) showSection(num, 'projects');
  showToast('🔒 Edit access locked');
}

function copySectionPasskey() {
  const inp = document.getElementById('sef-passkey');
  if (!inp.value) return;
  navigator.clipboard.writeText(inp.value).then(() => showToast('Passkey copied'));
}
async function regenerateSectionPasskey() {
  if (!await customConfirm('Generate a new passkey? The old one will no longer work for anyone using it.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  document.getElementById('sef-passkey').value = generatePasskey();
}
function closeSectionModal() { document.getElementById('section-modal-overlay').classList.remove('open'); }
function maybeCloseSection(e) { if (_shouldCloseOverlay(e, 'section-modal-overlay')) closeSectionModal(); }

function saveSection() {
  const base = editSectionBase || 'handbook';
  const title = document.getElementById('sef-title').value.trim();
  const desc = getEditorHTML('sef-desc-editor');
  const passkeyInp = document.getElementById('sef-passkey');
  const passkey = passkeyInp ? passkeyInp.value.trim() : '';
  if (!title) { alert('Title is required.'); return; }
  const sectionsArr = sectionsOf(base);
  const entriesArr = entriesOf(base);

  if (editSectionNum) {
    // Number is auto-managed and immutable; only title/description/passkey change.
    const sec = findSection(editSectionNum, base);
    if (!sec) return;
    sec.title = title; sec.description = desc;
    if (base === 'projects' && passkey) sec.passkey = passkey;
    entriesArr.forEach(e => {
      if (sectionNumOf(e.id) === editSectionNum) e.section = `${editSectionNum}. ${title}`;
    });
  } else {
    // New section number is auto-assigned (next available), never typed.
    const nums = sectionsArr.map(s => parseInt(s.num)).filter(n => !isNaN(n));
    const num = String(nums.length ? Math.max(...nums) + 1 : 1);
    const newSec = { num, title, description: desc };
    if (base === 'projects') newSec.passkey = passkey || generatePasskey();
    sectionsArr.push(newSec);
  }

  closeSectionModal();
  saveAll('Saved');
  renderSidebar();
  if (currentView === 'section' && currentBase === base) showSection(currentSectionNum, base);
  else if (currentView === 'docview') renderDocView();
}

async function deleteCurrentSection() {
  if (!editSectionNum) return;
  if (!isAdminMode) { alert('Deleting a section requires real Admin Mode (the passkey only grants edit access within the section).'); return; }
  const base = editSectionBase || 'handbook';
  const label = base === 'projects' ? 'Project' : 'Section';
  const hasEntries = entriesInSection(editSectionNum, base).length > 0;
  if (hasEntries && !await customConfirm(`${label} ${editSectionNum} has entries. Delete the ${label.toLowerCase()} AND all its entries permanently?`, { danger: true, confirmLabel: 'Delete ' + label.toLowerCase() })) return;
  if (!hasEntries && !await customConfirm(`Delete ${label.toLowerCase()} ${editSectionNum}?`, { danger: true, confirmLabel: 'Delete ' + label.toLowerCase() })) return;
  if (base === 'projects') {
    PROJECT_ENTRIES = PROJECT_ENTRIES.filter(e => sectionNumOf(e.id) !== editSectionNum);
    PROJECTS = PROJECTS.filter(s => s.num !== editSectionNum);
  } else {
    HANDBOOK = HANDBOOK.filter(e => sectionNumOf(e.id) !== editSectionNum);
    SECTIONS = SECTIONS.filter(s => s.num !== editSectionNum);
  }
  closeSectionModal();
  saveAll(`${label} deleted`);
  if (currentSectionNum === editSectionNum && currentBase === base) showHome();
  else renderSidebar();
  if (currentView === 'docview') renderDocView();
}

/* ══════════════════════════════════════════
   SIDEBAR ITEM EDITOR (Quick Links / Team)
   ══════════════════════════════════════════ */
function openSIEditor(sectionId, itemId) {
  const sec = SIDEBAR_CFG.find(s => s.id === sectionId);
  if (!sec) return;
  const item = sec.items.find(i => i.id === itemId);
  if (!item) return;
  editSISection = sectionId; editSIItemId = itemId;
  document.getElementById('si-text').value = item.text;
  document.getElementById('si-href').value = item.href || '';
  document.getElementById('si-visible').value = String(item.visible !== false);
  document.getElementById('si-modal-overlay').classList.add('open');
}
function openNewSIEditor(sectionId) {
  editSISection = sectionId; editSIItemId = null;
  document.getElementById('si-text').value = '';
  document.getElementById('si-href').value = '';
  document.getElementById('si-visible').value = 'true';
  document.getElementById('si-modal-overlay').classList.add('open');
}
function closeSIModal() { document.getElementById('si-modal-overlay').classList.remove('open'); }
function maybeCloseSI(e) { if (_shouldCloseOverlay(e, 'si-modal-overlay')) closeSIModal(); }
function saveSidebarItem() {
  const sec = SIDEBAR_CFG.find(s => s.id === editSISection); if (!sec) return;
  const text = document.getElementById('si-text').value.trim();
  if (!text) { alert('Display text is required.'); return; }
  const href = document.getElementById('si-href').value.trim() || null;
  const visible = document.getElementById('si-visible').value === 'true';
  if (editSIItemId) {
    const item = sec.items.find(i => i.id === editSIItemId);
    if (item) { item.text = text; item.href = href; item.visible = visible; }
  } else {
    sec.items.push({ id: 'item-' + Date.now(), text, href, visible });
  }
  closeSIModal(); saveSidebarOnly(); renderSidebar();
}
async function deleteSidebarItem() {
  if (!editSIItemId) return;
  if (!await customConfirm('Remove this sidebar item?', { danger: true, confirmLabel: 'Remove' })) return;
  const sec = SIDEBAR_CFG.find(s => s.id === editSISection);
  if (sec) sec.items = sec.items.filter(i => i.id !== editSIItemId);
  closeSIModal(); saveSidebarOnly(); renderSidebar();
}

/* ══════════════════════════════════════════
   ANNOUNCEMENTS
   ══════════════════════════════════════════ */
function renderAnnouncements() {
  const c = document.getElementById('whats-new');
  const visible = ANNOUNCEMENTS.filter(a => !dismissedAnns.has(a.id));
  const show = visible.length > 0 || isAdminMode;
  if (!show) { c.innerHTML = ''; return; }
  const itemsHtml = visible.map(a => `
    <div class="ann-item" data-ann-id="${escAttr(a.id)}">
      <div class="ann-dot"></div>
      <div class="ann-content">
        <div class="ann-date">${escapeHtml(a.date)}${a.author ? ' · ' + escapeHtml(a.author) : ''}</div>
        <div class="ann-text">${escapeHtml(a.text)}</div>
      </div>
      <div class="ann-actions">
        ${isAdminMode ? `
          <button class="ann-edit-btn" onclick="openAnnEditor('${escJsAttr(a.id)}')" title="Edit">✎</button>
          <button class="ann-dismiss-btn" onclick="deleteAnnouncementAdmin('${escJsAttr(a.id)}')" title="Delete announcement (visible to everyone)">🗑</button>
        ` : ''}
      </div>
    </div>
  `).join('');
  const addBtn = isAdminMode ? `<button class="ann-add-btn" onclick="openNewAnnEditor()">＋ New</button>` : '';
  c.innerHTML = `<div class="ann-header"><span class="ann-label">What's New</span>${addBtn}</div>
    ${itemsHtml}${visible.length === 0 && isAdminMode ? '<div style="font-size:12px;color:var(--mid)">No announcements yet.</div>' : ''}`;
}
function dismissAnn(id) { /* deprecated — kept for back-compat */ dismissedAnns.add(id); saveAnnsOnly(); renderAnnouncements(); }
async function deleteAnnouncementAdmin(id) {
  if (!isAdminMode) return;
  if (!await customConfirm('Delete this announcement for everyone? This cannot be undone.', { danger: true, confirmLabel: 'Delete announcement' })) return;
  ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== id);
  dismissedAnns.delete(id);
  saveAnnsOnly();
  fbSyncKey('announcements', ANNOUNCEMENTS);
  renderAnnouncements();
  showToast('Announcement deleted');
}
function openAnnEditor(id) {
  const a = ANNOUNCEMENTS.find(x => x.id === id); if (!a) return;
  editAnnId = id;
  document.getElementById('ann-modal-title-text').textContent = 'Edit Announcement';
  document.getElementById('ann-text-input').value = a.text;
  document.getElementById('ann-author-input').value = a.author || '';
  document.getElementById('delete-ann-btn').style.display = '';
  document.getElementById('ann-modal-overlay').classList.add('open');
}
function openNewAnnEditor() {
  editAnnId = null;
  document.getElementById('ann-modal-title-text').textContent = 'New Announcement';
  document.getElementById('ann-text-input').value = '';
  document.getElementById('ann-author-input').value = '';
  document.getElementById('delete-ann-btn').style.display = 'none';
  document.getElementById('ann-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('ann-text-input').focus(), 60);
}
function closeAnnModal() { document.getElementById('ann-modal-overlay').classList.remove('open'); }
function maybeCloseAnn(e) { if (_shouldCloseOverlay(e, 'ann-modal-overlay')) closeAnnModal(); }
function saveAnn() {
  const text = document.getElementById('ann-text-input').value.trim();
  if (!text) { alert('Message required.'); return; }
  const author = document.getElementById('ann-author-input').value.trim();
  const date = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  if (editAnnId) {
    const idx = ANNOUNCEMENTS.findIndex(a => a.id === editAnnId);
    if (idx !== -1) { ANNOUNCEMENTS[idx].text = text; ANNOUNCEMENTS[idx].author = author; }
    dismissedAnns.delete(editAnnId);
  } else {
    ANNOUNCEMENTS.unshift({ id:'ann-'+Date.now(), date, author, text });
  }
  closeAnnModal(); saveAnnsOnly(); renderAnnouncements();
  showToast('Announcement posted');
}
async function deleteCurrentAnn() {
  if (!editAnnId) return;
  if (!await customConfirm('Delete this announcement?', { danger: true, confirmLabel: 'Delete' })) return;
  ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== editAnnId);
  dismissedAnns.delete(editAnnId);
  closeAnnModal(); saveAnnsOnly(); renderAnnouncements();
}

/* ══════════════════════════════════════════
   EXPORT / IMPORT
   ══════════════════════════════════════════ */
function exportData() {
  const data = {
    sections: SECTIONS, handbook: HANDBOOK,
    projects: PROJECTS, projectEntries: PROJECT_ENTRIES,
    customCategories: CUSTOM_CATEGORIES,
    settings: SITE_SETTINGS,
    sidebar: SIDEBAR_CFG,
    announcements: ANNOUNCEMENTS, synonyms: SYNONYMS, team: TEAM_DIRECTORY,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'vl-dashboard-backup.json'; a.click();
  URL.revokeObjectURL(a.href);
  showToast('Exported backup');
}

function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.handbook) { alert('Invalid backup file.'); return; }
      if (!await customConfirm('This will replace all data (handbook, projects, sidebar, announcements, synonyms, team). Continue?', { danger: true, confirmLabel: 'Replace all data' })) return;
      SECTIONS = data.sections || clone(DEFAULT_SECTIONS);
      HANDBOOK = data.handbook;
      PROJECTS = data.projects || [];
      PROJECT_ENTRIES = data.projectEntries || [];
      CUSTOM_CATEGORIES = data.customCategories || [];
      SITE_SETTINGS = data.settings ? Object.assign({}, DEFAULT_SITE_SETTINGS, data.settings) : clone(DEFAULT_SITE_SETTINGS);
      SIDEBAR_CFG = data.sidebar || clone(DEFAULT_SIDEBAR_CFG);
      ANNOUNCEMENTS = data.announcements || [];
      SYNONYMS = data.synonyms || clone(DEFAULT_SYNONYMS);
      TEAM_DIRECTORY = data.team || [];
      dismissedAnns = new Set();
      saveAll('Import complete');
      // Imported entries likely lack current-version embeddings — backfill in the background.
      setTimeout(() => runBackfillEmbeddings(), 500);
      applyAllSettings(); renderSidebar(); renderAnnouncements(); showHome();
    } catch(err) { alert('Could not parse file: ' + err.message); }
  };
  r.readAsText(file); e.target.value = '';
}

/* ══════════════════════════════════════════
   SYNONYMS EDITOR (admin)
   ══════════════════════════════════════════ */
let _synWorking = [];

function openSynonymsEditor() {
  _synWorking = JSON.parse(JSON.stringify(SYNONYMS));
  renderSynGroups();
  document.getElementById('syn-modal-overlay').classList.add('open');
}
function closeSynModal() { document.getElementById('syn-modal-overlay').classList.remove('open'); }
function maybeCloseSyn(e) { if (_shouldCloseOverlay(e, 'syn-modal-overlay')) closeSynModal(); }

function renderSynGroups() {
  const list = document.getElementById('syn-groups-list');
  list.innerHTML = _synWorking.map((group, i) => `
    <div class="syn-group-row">
      <textarea class="syn-group-input" rows="1" oninput="updateSynGroup(${i}, this.value)"
        placeholder="comma-separated, terms, here">${escapeHtml(Array.isArray(group) ? group.join(', ') : '')}</textarea>
      <button class="syn-del-btn" onclick="removeSynGroup(${i})" title="Delete group">✕</button>
    </div>
  `).join('');
}
function updateSynGroup(i, value) {
  _synWorking[i] = value.split(',').map(s => s.trim()).filter(Boolean);
}
function addSynGroup() {
  _synWorking.push([]);
  renderSynGroups();
  // Focus the last input
  setTimeout(() => {
    const inputs = document.querySelectorAll('.syn-group-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 30);
}
function removeSynGroup(i) {
  _synWorking.splice(i, 1);
  renderSynGroups();
}
function saveSynonyms() {
  SYNONYMS = _synWorking.filter(g => Array.isArray(g) && g.length > 0);
  saveSynonymsOnly();
  closeSynModal();
}
async function resetSynonymsToDefault() {
  if (!await customConfirm('Reset all synonyms to defaults? Your custom groups will be lost.', { danger: true, confirmLabel: 'Reset synonyms' })) return;
  _synWorking = JSON.parse(JSON.stringify(DEFAULT_SYNONYMS));
  renderSynGroups();
}

/* ══════════════════════════════════════════
   TEAM DIRECTORY
   ══════════════════════════════════════════ */
// Timezone list with friendly labels. The IANA name is the stored value (`tz`);
// `label` is what appears in the dropdown so people can find their country.
const TIMEZONES = [
  { tz:'Pacific/Honolulu',                label:'Hawaii (HST) — Honolulu' },
  { tz:'America/Anchorage',               label:'Alaska (AKT) — Anchorage' },
  { tz:'America/Los_Angeles',             label:'US Pacific (PT) — Los Angeles' },
  { tz:'America/Denver',                  label:'US Mountain (MT) — Denver' },
  { tz:'America/Phoenix',                 label:'US Arizona (MST, no DST) — Phoenix' },
  { tz:'America/Chicago',                 label:'US Central (CT) — Chicago' },
  { tz:'America/New_York',                label:'US Eastern (ET) — New York' },
  { tz:'America/Toronto',                 label:'Canada Eastern (ET) — Toronto' },
  { tz:'America/Mexico_City',             label:'Mexico (CT) — Mexico City' },
  { tz:'America/Sao_Paulo',               label:'Brazil (BRT) — São Paulo' },
  { tz:'America/Argentina/Buenos_Aires',  label:'Argentina (ART) — Buenos Aires' },
  { tz:'UTC',                             label:'UTC — Coordinated Universal Time' },
  { tz:'Europe/London',                   label:'UK (GMT/BST) — London' },
  { tz:'Europe/Berlin',                   label:'Germany (CET) — Berlin' },
  { tz:'Europe/Paris',                    label:'France (CET) — Paris' },
  { tz:'Europe/Madrid',                   label:'Spain (CET) — Madrid' },
  { tz:'Europe/Athens',                   label:'Greece (EET) — Athens' },
  { tz:'Africa/Cairo',                    label:'Egypt (EET) — Cairo' },
  { tz:'Africa/Johannesburg',             label:'South Africa (SAST) — Johannesburg' },
  { tz:'Asia/Dubai',                      label:'UAE (GST) — Dubai' },
  { tz:'Asia/Karachi',                    label:'Pakistan (PKT) — Karachi' },
  { tz:'Asia/Kolkata',                    label:'India (IST) — Kolkata' },
  { tz:'Asia/Bangkok',                    label:'Thailand (ICT) — Bangkok' },
  { tz:'Asia/Singapore',                  label:'Singapore (SGT)' },
  { tz:'Asia/Manila',                     label:'Philippines (PHT) — Manila' },
  { tz:'Asia/Hong_Kong',                  label:'Hong Kong (HKT)' },
  { tz:'Asia/Shanghai',                   label:'China (CST) — Shanghai' },
  { tz:'Asia/Tokyo',                      label:'Japan (JST) — Tokyo' },
  { tz:'Asia/Seoul',                      label:'South Korea (KST) — Seoul' },
  { tz:'Australia/Perth',                 label:'Australia Western (AWST) — Perth' },
  { tz:'Australia/Sydney',                label:'Australia Eastern (AET) — Sydney' },
  { tz:'Pacific/Auckland',                label:'New Zealand (NZT) — Auckland' }
];

function tzLabel(tz) {
  if (!tz) return '';
  const found = TIMEZONES.find(o => o.tz === tz);
  return found ? found.label : tz; // fall back to raw IANA if not in our list
}

let editingTmId = null;
let tmEditMode = false;
let _tmDraft = null; // draft of current edit

// KPI section UI state — reset on profile open so each profile starts fresh.
let _kpiYear = null;            // currently-selected year (number)
let _kpiQuarter = null;         // currently-selected quarter 1..4
let _kpiSubview = 'quarter';    // 'quarter' | 'trends'
let _kpiOpenCats = new Set();   // category indices currently expanded in the drill-in
// Trends (pairwise comparison) state:
let _kpiCmpFrom = null;         // 'YYYY-QN' key of the "from" quarter
let _kpiCmpTo = null;           // 'YYYY-QN' key of the "to" quarter
let _kpiCmpSort = 'worst';      // 'worst' (worst-first) | 'best' (best-first)
let _kpiNoteEdit = null;        // { pair, cat, id|null } while a coaching note is being added/edited
// Remembers the last-displayed animated value per logical element (keyed by a
// stable data-anim-key like "overall-gauge" / "cat-bar-0"). On a quarter
// switch the next fill/count animates FROM the remembered value TO the new one,
// so an increase or decrease is immediately visible (instead of refilling from
// 0). Reset when a different profile is opened.
let _kpiLastAnim = {};
function _kpiResetUiState() {
  _kpiYear = null; _kpiQuarter = null; _kpiSubview = 'quarter'; _kpiOpenCats = new Set();
  _kpiCmpFrom = null; _kpiCmpTo = null; _kpiCmpSort = 'worst';
  _kpiNoteEdit = null;
  _kpiLastAnim = {};
}

function openTeamDirectory() {
  renderTeamRoster();
  // Show the admin-only "All Passkeys" button when admin mode is on so admins
  // can quickly look up / rotate codes when teammates DM "I lost my passkey".
  const pkBtn = document.getElementById('team-passkeys-btn');
  if (pkBtn) pkBtn.style.display = isAdminMode ? '' : 'none';
  document.getElementById('team-modal-overlay').classList.add('open');
}
function closeTeamModal() { document.getElementById('team-modal-overlay').classList.remove('open'); }
function maybeCloseTeamModal(e) { if (_shouldCloseOverlay(e, 'team-modal-overlay')) closeTeamModal(); }

function renderTeamRoster() {
  const grid = document.getElementById('team-roster-grid');
  const cards = TEAM_DIRECTORY.map(m => `
    <div class="tm-card" onclick="openTmDetail('${escJsAttr(m.id)}')">
      <div class="tm-card-avatar">
        ${m.image ? `<img src="${escAttr(m.image)}" alt="${escAttr(m.realName||'')}"/>` : defaultPersonIconSvg(40)}
      </div>
      <div class="tm-card-name">${escapeHtml(m.slackName ? '@' + m.slackName.replace(/^@/, '') : '(no slack)')}</div>
      <div class="tm-card-slack">${escapeHtml(m.realName || 'Unnamed')}</div>
      <div class="tm-card-projects">
        ${(m.projects||[]).slice(0,3).map(p => `<span class="tm-card-project-chip">${escapeHtml(p)}</span>`).join('')}
        ${(m.projects||[]).length > 3 ? `<span class="tm-card-project-chip">+${(m.projects||[]).length-3}</span>` : ''}
      </div>
    </div>
  `).join('');
  const addCard = `<div class="tm-add-card" onclick="openNewTeamMember()">＋<br>Add Team Member</div>`;
  grid.innerHTML = cards + addCard;
}

function defaultPersonIconSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;
}

function blankTm() {
  return {
    id: 'tm-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
    image: '',
    slackName: '',
    realName: '',
    projects: [],
    schedule: { signIn: '', signOut: '', timezone: 'America/New_York' },
    badges: '',
    expertise: '',
    artStyle: '',
    favoriteGenre: '',
    favoriteGames: '',
    portfolio: '',
    // Each profile gets a unique 8-char passkey on creation. Only the holder
    // of this code can edit/update the profile (unless admin mode is on).
    // Visible to the owner once at creation time via a "Save this passkey!"
    // modal, and to admins via the bottom of the profile view in admin mode.
    passkey: generatePasskey(),
    // KPI store: keys are scope strings like "2026-Q1", values are the parsed
    // KPI report (see parseKpiCsv). Empty by default. Visible to the owner
    // (via their passkey) and to admins; uploads are admin-only.
    kpi: {},
    // Coaching notes on KPI comparisons. Keyed by comparison pair then
    // category title: { "2026-Q1->2026-Q2": { "Creative Vision …": [ {id,text,ts} ] } }.
    // Admin-authored, viewable by owner+admin. Tied to the exact From→To pair.
    kpiNotes: {},
    _createdAt: Date.now(),
    _updatedAt: Date.now()
  };
}

// Backfill: any team member without a passkey gets one, and any member
// without a kpi map gets an empty one. Returns true if any member was
// updated, so the caller can re-persist + push to Firebase. Also regenerates
// duplicate passkeys so login-by-passkey is unambiguous.
function _ensureTeamPasskeys() {
  if (!Array.isArray(TEAM_DIRECTORY)) return false;
  let changed = false;
  const seen = new Set();
  for (const m of TEAM_DIRECTORY) {
    if (!m || typeof m !== 'object') continue;
    if (!m.passkey || seen.has(m.passkey.toUpperCase())) {
      // Rotate until we land on something globally unique within the directory.
      do { m.passkey = generatePasskey(); } while (seen.has(m.passkey.toUpperCase()));
      changed = true;
    }
    seen.add(m.passkey.toUpperCase());
    // KPI map backfill — profiles pre-dating the KPI feature have no `kpi`
    // field. Initialize it to an empty object so the rest of the code can
    // assume it exists.
    if (!m.kpi || typeof m.kpi !== 'object') { m.kpi = {}; changed = true; }
    if (!m.kpiNotes || typeof m.kpiNotes !== 'object') { m.kpiNotes = {}; changed = true; }
  }
  if (changed) {
    try { localStorage.setItem('vl_team', JSON.stringify(TEAM_DIRECTORY)); } catch(e){}
    if (typeof fbSyncKey === 'function') { try { fbSyncKey('team', TEAM_DIRECTORY); } catch(e){} }
  }
  return changed;
}

// Ownership / edit-permission check for a team-member profile.
// Admin can always edit; the holder of the profile's passkey (= currentUser)
// can edit their own profile; everyone else gets a view-only experience.
function canEditTm(m) {
  if (isAdminMode) return true;
  if (!m) return false;
  if (currentUser && currentUser.tmId === m.id) return true;
  return false;
}

function openTmDetail(id) {
  const m = TEAM_DIRECTORY.find(x => x.id === id);
  if (!m) return;
  editingTmId = id;
  _tmDraft = JSON.parse(JSON.stringify(m));
  if (!_tmDraft.kpi || typeof _tmDraft.kpi !== 'object') _tmDraft.kpi = {};
  tmEditMode = false;
  _kpiResetUiState();
  document.getElementById('tm-detail-title').textContent = m.realName || 'Team Member';
  // Delete is owner-or-admin; hide otherwise. renderTmDetail() reasserts this
  // each render so we stay correct after admin-mode toggle while open.
  document.getElementById('tm-delete-btn').style.display = canEditTm(m) ? '' : 'none';
  renderTmDetail();
  document.getElementById('tm-detail-overlay').classList.add('open');
}

function openNewTeamMember() {
  editingTmId = null;
  _tmDraft = blankTm();
  tmEditMode = true;
  document.getElementById('tm-detail-title').textContent = 'New Team Member';
  document.getElementById('tm-delete-btn').style.display = 'none';
  renderTmDetail();
  document.getElementById('tm-detail-overlay').classList.add('open');
}

function closeTmDetail() {
  document.getElementById('tm-detail-overlay').classList.remove('open');
  editingTmId = null; _tmDraft = null; tmEditMode = false;
}
function maybeCloseTmDetail(e) {
  if (_shouldCloseOverlay(e, 'tm-detail-overlay')) closeTmDetail();
}

function toggleTmEditMode() {
  // Guard: a non-owner non-admin shouldn't be able to flip into edit mode even
  // if they craft a click. The Edit toggle is hidden via CSS for them, but
  // defense-in-depth keeps state consistent.
  if (!canEditTm(_tmDraft)) { tmEditMode = false; renderTmDetail(); return; }
  tmEditMode = !tmEditMode;
  renderTmDetail();
}

function renderTmDetail() {
  const m = _tmDraft;
  // Force view-only if the current viewer doesn't own this profile and isn't
  // an admin. They can still browse but can never enter edit mode.
  if (!canEditTm(m)) tmEditMode = false;
  const editing = tmEditMode;
  const canEdit = canEditTm(m);
  const body = document.getElementById('tm-detail-body');

  // Mode toggle button: visible only when the viewer can edit. Save button is
  // visible only when in edit mode. Delete button mirrors edit permission.
  const modeBtn = document.getElementById('tm-mode-btn');
  if (canEdit) {
    modeBtn.style.display = '';
    modeBtn.textContent = editing ? '👁 View Mode' : '✎ Edit';
    modeBtn.classList.toggle('editing', editing);
  } else {
    modeBtn.style.display = 'none';
  }
  document.getElementById('tm-save-btn').style.display = editing ? 'inline-block' : 'none';
  // Hide delete unless owner/admin AND the profile already exists (i.e. has an id in the directory).
  const delBtn = document.getElementById('tm-delete-btn');
  if (delBtn) {
    const existsInDir = editingTmId && (TEAM_DIRECTORY || []).some(x => x.id === editingTmId);
    delBtn.style.display = (canEdit && existsInDir) ? '' : 'none';
  }

  // `filled` indicates whether the field currently has data. When true (and not
  // in edit mode), we hide the helper description so the card reads cleanly.
  // Callers that have a custom viewer must pass `filled` explicitly.
  const renderField = (opts) => {
    const { label, required, desc, value, editor, viewer } = opts;
    const filled = (opts.filled !== undefined) ? opts.filled : !!value;
    // In view mode: show desc only when empty (acts as helper for first-time fill).
    // In edit mode: show desc only when empty (so it disappears as user fills in).
    const showDesc = desc && !filled;
    return `<div class="tm-field">
      <div class="tm-field-label${required?' tm-field-required':''}">${escapeHtml(label)}</div>
      ${showDesc ? `<div class="tm-field-desc">${escapeHtml(desc)}</div>` : ''}
      ${editing ? editor : (viewer || `<div class="tm-field-value ${value?'':'empty'}">${value ? escapeHtml(value) : '(not set)'}</div>`)}
    </div>`;
  };

  const html = `
    <!-- ── IDENTITY ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">👤</div>
        <div class="tm-section-title">Identity</div>
      </div>
      <div class="tm-section-body">
        ${editing ? `
          <div class="tm-identity" style="margin-bottom:14px">
            <div class="tm-avatar-big">
              ${m.image ? `<img src="${escAttr(m.image)}" alt=""/>` : defaultPersonIconSvg(48)}
            </div>
            <div class="tm-avatar-buttons" style="flex-direction:column;align-items:flex-start">
              <button class="btn btn-secondary" onclick="uploadTmImage()">📷 Upload Image</button>
              ${m.image ? `<button class="btn btn-danger" onclick="clearTmImage()">Remove Image</button>` : ''}
            </div>
          </div>
          ${renderField({
            label: 'Slack Name', required: true,
            desc: 'How can we ping you in Slack?',
            filled: !!m.slackName,
            editor: `<input class="form-input" id="tm-slackName" value="${escAttr(m.slackName||'')}" placeholder="@yourhandle"/>`
          })}
          ${renderField({
            label: 'Real Name', required: true,
            desc: "Let's see that beautiful name!",
            filled: !!m.realName,
            editor: `<input class="form-input" id="tm-realName" value="${escAttr(m.realName||'')}" placeholder="Your name"/>`
          })}
        ` : `
          <div class="tm-identity">
            <div class="tm-avatar-big">
              ${m.image ? `<img src="${escAttr(m.image)}" alt=""/>` : defaultPersonIconSvg(48)}
            </div>
            <div class="tm-identity-text">
              <div class="tm-identity-slack">${m.slackName ? escapeHtml('@' + m.slackName.replace(/^@/,'')) : '(no slack)'}</div>
              <div class="tm-identity-real">${m.realName ? escapeHtml(m.realName) : '(no name set)'}</div>
            </div>
          </div>
        `}
      </div>
    </div>

    <!-- ── WORK ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">💼</div>
        <div class="tm-section-title">Work</div>
      </div>
      <div class="tm-section-body">
        ${renderField({
          label: 'Projects', required: true,
          desc: 'Where are you assigned right now?',
          filled: (m.projects||[]).length > 0,
          editor: `<div class="tm-chips" id="tm-projects-chips">
            ${(m.projects||[]).map((p, i) => `
              <span class="tm-chip">${escapeHtml(p)}<button class="tm-chip-x" onclick="removeTmProject(${i})" title="Remove">×</button></span>
            `).join('')}
            <input class="tm-chip-input" id="tm-project-input" placeholder="Type project + Enter" onkeydown="if(event.key==='Enter'){event.preventDefault();addTmProject(this.value);this.value='';}"/>
          </div>`,
          viewer: `<div class="tm-chips">
            ${(m.projects||[]).length
              ? (m.projects||[]).map(p => `<span class="tm-chip">${escapeHtml(p)}</span>`).join('')
              : `<div class="tm-field-value empty">(not assigned)</div>`}
          </div>`
        })}
        ${renderField({
          label: 'Schedule',
          desc: 'Your typical work hours and timezone.',
          filled: !!(m.schedule && m.schedule.signIn),
          editor: `<div class="tm-schedule-row">
            <input type="time" class="form-input" id="tm-signIn" value="${escAttr((m.schedule&&m.schedule.signIn)||'')}" title="Sign-in time"/>
            <input type="time" class="form-input" id="tm-signOut" value="${escAttr((m.schedule&&m.schedule.signOut)||'')}" title="Sign-out time"/>
            <select class="form-select" id="tm-timezone">
              ${TIMEZONES.map(o => `<option value="${escAttr(o.tz)}" ${((m.schedule&&m.schedule.timezone)===o.tz)?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}
            </select>
          </div>`,
          viewer: `<div class="tm-field-value ${(!m.schedule||!m.schedule.signIn)?'empty':''}">
            ${(m.schedule&&m.schedule.signIn) ? `<strong>${escapeHtml(m.schedule.signIn)} – ${escapeHtml(m.schedule.signOut||'?')}</strong> <span style="color:var(--mid)">${escapeHtml(tzLabel(m.schedule.timezone))}</span>` : '(not set)'}
          </div>`
        })}
      </div>
    </div>

    <!-- ── EXPERTISE ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">🎨</div>
        <div class="tm-section-title">Expertise & Style</div>
      </div>
      <div class="tm-section-body">
        ${renderField({
          label: 'Areas of Expertise',
          desc: 'Where do you shine the most?',
          value: m.expertise,
          editor: `<textarea class="form-textarea" id="tm-expertise" rows="2" placeholder="VFX, lighting, character design…">${escapeHtml(m.expertise||'')}</textarea>`
        })}
        ${renderField({
          label: 'Art Style',
          desc: 'What art style do you usually prefer working on?',
          value: m.artStyle,
          editor: `<input class="form-input" id="tm-artStyle" value="${escAttr(m.artStyle||'')}" placeholder="Stylized, semi-realistic, pixel art…"/>`
        })}
        ${renderField({
          label: 'Badge Showcase',
          editor: `<div class="tm-badge-placeholder">Related to the badge profession system. Coming soon!</div>`,
          viewer: `<div class="tm-badge-placeholder">Related to the badge profession system. Coming soon!</div>`
        })}
      </div>
    </div>

    <!-- ── PERSONAL ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">🎮</div>
        <div class="tm-section-title">Personal</div>
      </div>
      <div class="tm-section-body">
        <div class="tm-grid-2">
          ${renderField({
            label: 'Favorite Genre',
            desc: 'Your favorite game genre',
            value: m.favoriteGenre,
            editor: `<input class="form-input" id="tm-favoriteGenre" value="${escAttr(m.favoriteGenre||'')}" placeholder="JRPG, Soulslike, Roguelike…"/>`
          })}
          ${renderField({
            label: 'Portfolio Link',
            desc: 'Bless us with your art style!',
            filled: !!m.portfolio,
            editor: `<input class="form-input" id="tm-portfolio" value="${escAttr(m.portfolio||'')}" placeholder="https://..."/>`,
            viewer: `<div class="tm-field-value ${m.portfolio?'':'empty'}">${m.portfolio
              ? `<a class="tm-portfolio-link" href="${escAttr(m.portfolio)}" target="_blank" rel="noopener">🔗 ${escapeHtml(m.portfolio.length > 38 ? m.portfolio.substring(0, 38) + '…' : m.portfolio)}</a>`
              : '(not set)'}</div>`
          })}
        </div>
        ${renderField({
          label: 'Favorite Video Games',
          desc: 'Top 5 favorite games? Top 10? Top 20? Top 999 games?',
          filled: !!m.favoriteGames,
          editor: `<textarea class="form-textarea" id="tm-favoriteGames" rows="3" placeholder="One per line, or comma-separated">${escapeHtml(m.favoriteGames||'')}</textarea>`,
          viewer: `<div class="tm-field-value ${m.favoriteGames?'':'empty'}" style="white-space:pre-wrap">${m.favoriteGames ? escapeHtml(m.favoriteGames) : '(not set)'}</div>`
        })}
      </div>
    </div>

    ${canViewKpi(m) ? `
    <!-- ── KPI launcher (full report lives in its own modal) ── -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">📊</div>
        <div class="tm-section-title">Key Performance Indicators${isAdminMode ? ' <span class="admin-tag" style="margin-left:6px">Admin can upload</span>' : ''}</div>
      </div>
      <div class="tm-section-body">
        <div class="kpi-launcher">
          <button class="btn btn-primary" onclick="openKpiViewer()">📊 Open KPI Report</button>
          <span class="kpi-launcher-hint">View quarterly evaluations, drill into metrics, and see multi-quarter trends${isAdminMode ? '. Admins can also upload new CSVs from inside the report' : ''}.</span>
        </div>
      </div>
    </div>
    ` : ''}

    ${isAdminMode && m.passkey ? `
    <!-- ── PASSKEY (admin-only view) ── -->
    <!-- The owner saw this code once at creation time. This section lets admins
         look it up later (e.g. when someone DMs "I lost my passkey") and rotate
         it if needed — rotating invalidates the old code immediately. -->
    <div class="tm-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">🔑</div>
        <div class="tm-section-title">Passkey <span class="admin-tag" style="margin-left:6px">Admin</span></div>
      </div>
      <div class="tm-section-body">
        <div class="tm-field-desc">Only this person (with this passkey) can edit their profile. Share securely if they lost it; rotate if compromised.</div>
        <div style="display:flex;gap:6px;align-items:center;margin-top:8px">
          <input class="form-input" id="tm-pk-display" readonly value="${escAttr(m.passkey)}"
            style="flex:1;font-family:'Consolas','Courier New',monospace;letter-spacing:0.12em;font-size:15px;text-align:center"/>
          <button type="button" class="btn btn-secondary" onclick="copyTmPasskey()">📋 Copy</button>
          <button type="button" class="btn btn-secondary" onclick="regenerateTmPasskey()" title="Generate a new passkey — the old one stops working immediately">↻ New</button>
        </div>
      </div>
    </div>
    ` : ''}
  `;
  body.innerHTML = html;
}

// Copy / rotate handlers for the admin-only passkey section.
function copyTmPasskey() {
  const inp = document.getElementById('tm-pk-display');
  if (!inp || !inp.value) return;
  navigator.clipboard.writeText(inp.value).then(
    () => showToast('Passkey copied'),
    () => { inp.select(); document.execCommand && document.execCommand('copy'); showToast('Passkey copied'); }
  );
}
async function regenerateTmPasskey() {
  if (!isAdminMode) return;
  if (!_tmDraft) return;
  if (!await customConfirm('Generate a new passkey for this profile? The old one will stop working immediately, including for any existing logged-in session.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  // New code, globally unique within the directory.
  const used = new Set((TEAM_DIRECTORY || []).map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
  let next;
  do { next = generatePasskey(); } while (used.has(next.toUpperCase()));
  _tmDraft.passkey = next;
  // Persist immediately to TEAM_DIRECTORY (so refresh / reopen sees it), even
  // if the admin doesn't click Save on other field edits. Keeps the rotation
  // atomic and surprise-free.
  const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
  if (idx >= 0) {
    TEAM_DIRECTORY[idx].passkey = next;
    saveTeamOnly();
  }
  // If we just rotated the CURRENT user's own passkey, refresh their stored
  // creds so they don't get bounced to the login screen on next reload.
  if (currentUser && currentUser.tmId === editingTmId) {
    setCurrentUser({ id: currentUser.tmId, slackName: currentUser.slackName, passkey: next }, currentUserPersistent);
  }
  renderTmDetail();
  showToast('Passkey rotated');
}

/* ══════════════════════════════════════════
   KPI VIEW — rendered inside the team-member profile modal.
   Privacy: only the owner (currentUser.tmId === m.id) OR an admin can see
   this section. The "Upload CSV" affordance is admin-only.
   ══════════════════════════════════════════ */

// Visibility predicate for the entire KPI section.
function canViewKpi(m) {
  if (!m) return false;
  if (isAdminMode) return true;
  if (currentUser && currentUser.tmId === m.id) return true;
  return false;
}

// Map a score percentage (0-100) onto the 1-5 band used for color + label.
function _kpiBandForPercent(pct) {
  if (pct < 20)  return { n: 1, label: 'Needs Improvement' };
  if (pct < 40)  return { n: 2, label: 'Meets Minimum' };
  if (pct < 60)  return { n: 3, label: 'Solid Performer' };
  if (pct < 80)  return { n: 4, label: 'Exceeds Expectations' };
  return            { n: 5, label: 'Outstanding' };
}
function _kpiPercent(score, max) { return max ? Math.max(0, Math.min(100, (score / max) * 100)) : 0; }

// All scope keys for a member sorted oldest → newest (chronological).
function _kpiSortedKeys(m) {
  const keys = Object.keys(m.kpi || {});
  return keys.sort((a, b) => {
    const [ay, aq] = a.split('-Q').map(Number);
    const [by, bq] = b.split('-Q').map(Number);
    return ay === by ? aq - bq : ay - by;
  });
}

// SVG: circular gauge showing overall % with a band color + score label.
function _kpiGaugeSvg(score, max, label) {
  const pct  = _kpiPercent(score, max);
  const band = _kpiBandForPercent(pct);
  const r = 50, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  // SVG stroke colors mirror the .kpi-band-N classes so the gauge matches
  // the bar chart's color language.
  const fill = ['#c0392b','#e67e22','#f1c40f','#27ae60','#16a085'][band.n - 1];
  const offset = circ * (1 - pct / 100);
  // data-kpi-gauge/-off/-circ + data-count-to drive the open animation
  // (ring fills from empty, number counts 0→value). Rendered at final state
  // so no-animation / reduced-motion still shows the correct values.
  return `<svg class="kpi-gauge-svg" viewBox="0 0 120 120">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fill}" stroke-width="10"
      stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"
      data-kpi-gauge data-anim-key="overall-gauge" data-off="${offset.toFixed(2)}" data-circ="${circ.toFixed(2)}"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="800" fill="var(--text-body)" data-anim-key="overall-num" data-count-to="${Math.round(score)}">${Math.round(score)}</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="9" fill="var(--mid)" letter-spacing="1">OF ${Math.round(max)}</text>
  </svg>
  <div class="kpi-gauge-label kpi-band-${band.n}">${escapeHtml(label || band.label)}</div>`;
}

// Small radial gauge used in the pairwise comparison (before/after). Shows
// the score in the center, ring colored by band. `size` is the rendered px.
function _kpiMiniGauge(score, max, size) {
  size = size || 50;
  const pct = _kpiPercent(score, max);
  const band = _kpiBandForPercent(pct);
  const fill = ['#c0392b','#e67e22','#f1c40f','#27ae60','#16a085'][band.n - 1];
  const r = 20, cx = 24, cy = 24, sw = 5;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const disp = (score % 1 === 0) ? String(score) : (+score).toFixed(1);
  return `<svg class="kpi-mini-gauge" viewBox="0 0 48 48" width="${size}" height="${size}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fill}" stroke-width="${sw}"
      stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"
      data-kpi-gauge data-off="${offset.toFixed(2)}" data-circ="${circ.toFixed(2)}"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text-body)" data-count-to="${disp}">${disp}</text>
  </svg>`;
}

// LITERAL up / down / flat arrow icon — chunky, vertical (never sloped).
// `dir` is positive / negative / ~0; size controls viewBox dimension.
function _kpiArrowIcon(dir, size) {
  size = size || 14;
  // 14×14 viewBox; arrow body is a thick rectangle, head is a triangle.
  // Up: head at top, shaft going down. Down: head at bottom, shaft going up.
  // Flat: a horizontal dash (no triangle).
  if (dir > 0.5) {
    return `<svg viewBox="0 0 14 14" width="${size}" height="${size}" aria-label="up">
      <path d="M7 1 L13 7 L9.5 7 L9.5 13 L4.5 13 L4.5 7 L1 7 Z" fill="currentColor"/>
    </svg>`;
  }
  if (dir < -0.5) {
    return `<svg viewBox="0 0 14 14" width="${size}" height="${size}" aria-label="down">
      <path d="M7 13 L13 7 L9.5 7 L9.5 1 L4.5 1 L4.5 7 L1 7 Z" fill="currentColor"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 14 14" width="${size}" height="${size}" aria-label="flat">
    <rect x="2" y="6" width="10" height="2" rx="1" fill="currentColor"/>
  </svg>`;
}

// Trend chip — JUST a chunky vertical arrow, no delta number. Hover
// tooltip carries the exact +/- pts for users who want the specifics.
// Returns empty string when only one quarter exists (foundational upload
// has nothing to compare against).
function _kpiTrendChip(series) {
  if (!series || series.length < 2) return '';
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const d = last - prev;
  const cls = d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
  const sign = d > 0 ? '+' : '';
  const tipText = (cls === 'flat' ? 'No meaningful change' : `${sign}${d.toFixed(1)} pts vs previous quarter`);
  return `<span class="kpi-trend-chip ${cls}" title="${escapeHtml(tipText)}" data-arrow-dir="${cls}">${_kpiArrowIcon(d, 16)}</span>`;
}

// The whole KPI section HTML — returned as a string and dropped into
// renderTmDetail's body. Hidden entirely for non-owners/non-admins.
function renderKpiSection(m) {
  if (!canViewKpi(m)) return '';

  const kpi = m.kpi || {};
  const allKeys = _kpiSortedKeys(m);

  // Build the year dropdown set: every year that has data + the current year.
  // Sorted DESCENDING so the most recent year shows first.
  const cur = _currentQuarter();
  const years = Array.from(new Set([
    ...allKeys.map(k => parseInt(k.split('-Q')[0], 10)).filter(n => isFinite(n)),
    cur.year
  ])).sort((a, b) => b - a);

  if (!_kpiYear || !years.includes(_kpiYear)) _kpiYear = years[0];
  // Default quarter pick: current quarter if viewing current year and it has
  // data; otherwise first quarter with data; otherwise Q1.
  if (!_kpiQuarter) {
    const candidates = [1, 2, 3, 4];
    const dataQ = candidates.find(q => kpi[_scopeKey(_kpiYear, q)]);
    if (_kpiYear === cur.year && kpi[_scopeKey(cur.year, cur.quarter)]) _kpiQuarter = cur.quarter;
    else if (dataQ) _kpiQuarter = dataQ;
    else _kpiQuarter = 1;
  }

  const yearOpts = years.map(y => `<option value="${y}" ${y === _kpiYear ? 'selected' : ''}>${y}</option>`).join('');

  // Quarter tabs with status pills.
  const quarterTabsHtml = [1, 2, 3, 4].map(q => {
    const has = !!kpi[_scopeKey(_kpiYear, q)];
    const future = _isFutureQuarter(_kpiYear, q);
    const cls = ['kpi-tab'];
    if (q === _kpiQuarter && !future) cls.push('active');
    if (!has && !future) cls.push('missing');
    if (future) cls.push('disabled');
    const mark = has ? '✓' : (future ? '·' : '⚠');
    const label = future ? 'Future' : (has ? 'Uploaded' : 'Missing');
    const click = future ? '' : `onclick="kpiSelectQuarter(${q})"`;
    return `<div class="${cls.join(' ')}" ${click} title="Q${q} ${_kpiYear} — ${label}">
      <span>Q${q}</span><span class="kpi-tab-mark">${mark}</span>
    </div>`;
  }).join('');

  const hasMultiQuarters = allKeys.length >= 2;
  const subviewHtml = hasMultiQuarters ? `
    <div class="kpi-subtabs">
      <div class="kpi-subtab${_kpiSubview === 'quarter' ? ' active' : ''}" onclick="kpiSetSubview('quarter')">KPI View</div>
      <div class="kpi-subtab${_kpiSubview === 'trends' ? ' active' : ''}" onclick="kpiSetSubview('trends')">Trends</div>
    </div>` : '';

  // Admin-only controls: upload + (when the current quarter has data) delete.
  const currentSelectedKey = _scopeKey(_kpiYear, _kpiQuarter);
  const currentHasData = !!kpi[currentSelectedKey];
  const isTrends = _kpiSubview === 'trends' && hasMultiQuarters;

  // Toolbar left side:
  //   KPI View → YEAR dropdown.
  //   Trends   → the From→To compare controls (live here, in the same box as
  //              Upload CSV / Print, styled like the YEAR dropdown), so the
  //              Q1–Q4 tabs and a separate picker card aren't needed.
  let leftControls;
  if (isTrends) {
    const cmpKeys = _kpiSortedKeys(m);   // ascending (chronological)
    // Chronological-only comparison: From must come strictly BEFORE To.
    // Default = earliest → latest, then clamp so the pair is always forward.
    if (!_kpiCmpFrom || !cmpKeys.includes(_kpiCmpFrom)) _kpiCmpFrom = cmpKeys[0];
    if (!_kpiCmpTo   || !cmpKeys.includes(_kpiCmpTo))   _kpiCmpTo   = cmpKeys[cmpKeys.length - 1];
    let fromIdx = cmpKeys.indexOf(_kpiCmpFrom);
    let toIdx   = cmpKeys.indexOf(_kpiCmpTo);
    // The last quarter can't be a "From" (nothing after it to compare to).
    if (fromIdx >= cmpKeys.length - 1) { fromIdx = cmpKeys.length - 2; _kpiCmpFrom = cmpKeys[fromIdx]; }
    // Keep To strictly after From — bump it forward if it landed at/before.
    if (toIdx <= fromIdx) { toIdx = fromIdx + 1; _kpiCmpTo = cmpKeys[toIdx]; }

    const cmpLabel = (key) => { const [y, q] = key.split('-Q'); return `Q${q} ${y}`; };
    // From list: only quarters that have at least one later quarter.
    const fromOpts = cmpKeys.slice(0, cmpKeys.length - 1)
      .map(k => `<option value="${k}" ${k === _kpiCmpFrom ? 'selected' : ''}>${cmpLabel(k)}</option>`).join('');
    // To list: only quarters chronologically AFTER the selected From.
    const toOpts = cmpKeys.slice(fromIdx + 1)
      .map(k => `<option value="${k}" ${k === _kpiCmpTo ? 'selected' : ''}>${cmpLabel(k)}</option>`).join('');
    const sortLabel = _kpiCmpSort === 'worst' ? 'Worst first' : 'Strongest first';
    leftControls = `
      <label style="font-size:11.5px;color:var(--text-sub);font-weight:600;letter-spacing:0.06em">COMPARE</label>
      <select class="form-select" onchange="kpiCmpSetFrom(this.value)" style="min-width:90px">${fromOpts}</select>
      <span style="color:var(--mid);font-weight:700">→</span>
      <select class="form-select" onchange="kpiCmpSetTo(this.value)" style="min-width:90px">${toOpts}</select>
      <button class="btn btn-secondary" onclick="kpiCmpToggleSort()" title="Flip the ordering">⇅ ${escapeHtml(sortLabel)}</button>`;
  } else {
    leftControls = `
      <label style="font-size:11.5px;color:var(--text-sub);font-weight:600;letter-spacing:0.06em">YEAR</label>
      <select class="form-select" onchange="kpiSelectYear(this.value)" style="min-width:90px">${yearOpts}</select>`;
  }
  const uploadBtn = isAdminMode
    ? `<button class="btn btn-admin" onclick="kpiUploadStart()" title="Upload a CSV exported from the KPI Google Sheet">⬆ Upload CSV</button>`
    : '';
  // Delete is tied to the specific quarter being viewed — only in KPI View.
  const deleteBtn = (!isTrends && isAdminMode && currentHasData)
    ? `<button class="btn btn-danger" onclick="kpiDeleteQuarter()" title="Remove the CSV record for the quarter currently being viewed">🗑 Delete this quarter</button>`
    : '';

  const toolbar = `
    <div class="kpi-toolbar">
      ${leftControls}
      <div class="kpi-toolbar-spacer"></div>
      ${uploadBtn}
      ${deleteBtn}
      <button class="btn btn-secondary" onclick="kpiPrint()" title="Print or save as PDF">🖨 Print</button>
    </div>`;

  const tabs = isTrends ? '' : `<div class="kpi-tabs">${quarterTabsHtml}</div>`;

  // Body: either the selected quarter's report, the trends view, or an empty state.
  let body = '';
  if (_kpiSubview === 'trends' && hasMultiQuarters) {
    body = _renderKpiTrends(m);
  } else {
    const key = _scopeKey(_kpiYear, _kpiQuarter);
    const data = kpi[key];
    const future = _isFutureQuarter(_kpiYear, _kpiQuarter);
    if (future) {
      body = `<div class="kpi-empty">
        <div class="kpi-empty-icon">🗓</div>
        <strong>Q${_kpiQuarter} ${_kpiYear}</strong> hasn't happened yet.<br>
        Come back at the end of the quarter to upload evaluation data.
      </div>`;
    } else if (!data) {
      body = `<div class="kpi-empty">
        <div class="kpi-empty-icon">⚠</div>
        No KPI data uploaded for <strong>Q${_kpiQuarter} ${_kpiYear}</strong> yet.
        ${isAdminMode ? '<br>Click <strong>⬆ Upload CSV</strong> above to add it.' : '<br>Ask an admin to upload your evaluation CSV.'}
      </div>`;
    } else {
      body = _renderKpiQuarter(m, data);
    }
  }

  return `
    <!-- ── KPI ── -->
    <div class="tm-section kpi-section">
      <div class="tm-section-header">
        <div class="tm-section-icon">📊</div>
        <div class="tm-section-title">Key Performance Indicators${isAdminMode ? ' <span class="admin-tag" style="margin-left:6px">Admin can upload</span>' : ''}</div>
      </div>
      <div class="tm-section-body">
        ${subviewHtml}
        ${toolbar}
        ${tabs}
        ${body}
      </div>
    </div>
  `;
}

// Single-quarter report body — gauge + category bars + drill-in.
function _renderKpiQuarter(m, data) {
  const meta = data.meta || {};
  const cats = data.categories || [];

  // Trend chips compare the CURRENTLY-VIEWED quarter against the
  // chronologically-previous one (not the full series), so Q1 — which has
  // nothing before it on record — gets no chip, while Q2 compares to Q1.
  const allKeys = _kpiSortedKeys(m);
  const currentKey = data.meta.scope.key;
  const idxInSorted = allKeys.indexOf(currentKey);
  const prevKey = idxInSorted > 0 ? allKeys[idxInSorted - 1] : null;
  const prevReport = prevKey ? m.kpi[prevKey] : null;
  const trendChipFor = (catIdx) => {
    if (!prevReport) return '';
    const prevCat = (prevReport.categories || [])[catIdx];
    const curCat  = cats[catIdx];
    if (!prevCat || !curCat) return '';
    return _kpiTrendChip([prevCat.subtotal, curCat.subtotal]);
  };

  // Overall trend vs previous quarter — chunky arrow circle sitting beside
  // the radial gauge. Reuses the prevReport already computed above for the
  // per-category chips, so the comparison reference is identical and
  // first-time uploads get no arrow anywhere.
  let overallTrendHtml = '';
  if (prevReport) {
    const prevOverall = prevReport.meta?.overall || 0;
    const d = (meta.overall || 0) - prevOverall;
    const cls = d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
    const sign = d > 0 ? '+' : '';
    const [py, pq] = prevKey.split('-Q');
    const niceTip = (cls === 'flat')
      ? `No meaningful change vs Q${pq} ${py}`
      : `${sign}${d.toFixed(1)} pts vs Q${pq} ${py} (was ${prevOverall} of ${meta.overallMax})`;
    overallTrendHtml = `<div class="kpi-gauge-trend ${cls}" title="${escapeHtml(niceTip)}" aria-label="Overall trend" data-arrow-dir="${cls}">${_kpiArrowIcon(d, 22)}</div>`;
  }

  const header = `
    <div class="kpi-report-header">
      <div class="kpi-report-meta">
        <div class="kpi-meta-row"><span class="kpi-meta-label">Evaluator</span><strong>${escapeHtml(meta.evaluatorName || '—')}</strong>${meta.evaluatorPosition ? ` · <span style="color:var(--mid)">${escapeHtml(meta.evaluatorPosition)}</span>` : ''}</div>
        <div class="kpi-meta-row"><span class="kpi-meta-label">Evaluated</span><strong>${escapeHtml(meta.name || m.realName || '—')}</strong>${meta.position ? ` · <span style="color:var(--mid)">${escapeHtml(meta.position)}</span>` : ''}</div>
        <div class="kpi-meta-row"><span class="kpi-meta-label">Scope</span><strong>Q${meta.scope?.quarter} ${meta.scope?.year}</strong></div>
        ${meta.overallLabel ? `<div class="kpi-meta-row"><span class="kpi-meta-label">Rating</span><strong>${escapeHtml(meta.overallLabel)}</strong></div>` : ''}
      </div>
      <div class="kpi-report-gauge">
        ${overallTrendHtml}
        <div class="kpi-gauge-inner">
          ${_kpiGaugeSvg(meta.overall || 0, meta.overallMax || 100, meta.overallLabel || '')}
        </div>
      </div>
    </div>`;

  // Trend chips only appear when there is a chronologically-previous
  // quarter to compare the currently-viewed quarter against. First-time
  // uploads (and the first quarter on record) get no arrows per spec.
  const catList = cats.map((cat, ci) => {
    const pct  = _kpiPercent(cat.subtotal, cat.maxSubtotal);
    const band = _kpiBandForPercent(pct);
    const isOpen = _kpiOpenCats.has(ci);

    // Drill-in metric rows — pip-bar gauge + rating value chip. The pip bar
    // visually communicates "X out of 5" at a glance and partial-fills the
    // last active pip if the rating is a decimal (which the CSV format
    // may carry in the future). No "score / max" text — that was confusing
    // weight noise per user feedback.
    const metricRows = (cat.metrics || []).map((m2, mi) => {
      const rating = +(m2.rating || 0);
      // Color the pips by the rating's band (1..5 maps to band-1..5).
      // Use Math.ceil so a rating of 3.x still shows the band-4 color.
      const bandN  = Math.max(1, Math.min(5, Math.ceil(rating)));
      // Format rating for display: integer if whole, else 1 decimal.
      const ratingDisplay = (rating % 1 === 0) ? String(rating) : rating.toFixed(1);
      // Build five squircle pips.
      let pipsHtml = '';
      for (let i = 1; i <= 5; i++) {
        const fillFrac = Math.max(0, Math.min(1, rating - (i - 1)));
        const w = (fillFrac * 100).toFixed(1) + '%';
        // No per-pip data-fill-to — the whole bar animates as ONE sweep
        // (see _kpiAnimPipBar) driven by data-pip-rating on the wrapper.
        pipsHtml += `<div class="kpi-pip"><div class="kpi-pip-fill kpi-band-${bandN}" style="width:${w}"></div></div>`;
      }
      return `<div class="kpi-metric">
        <div class="kpi-metric-head">
          <div>
            <div class="kpi-metric-title">${escapeHtml(m2.title)}
              <span class="kpi-metric-rating-chip kpi-band-${bandN}">${ratingDisplay}</span>
            </div>
            ${m2.description ? `<div class="kpi-metric-desc">${escapeHtml(m2.description)}</div>` : ''}
          </div>
        </div>
        <div class="kpi-pip-bar" aria-label="Rating ${ratingDisplay} of 5" data-pip-rating="${rating}" data-anim-key="pip-${ci}-${mi}">${pipsHtml}</div>
        ${_kpiNotesBlock(m, currentKey, _kpiMetricNoteKey(cat.title, m2.title))}
      </div>`;
    }).join('');

    return `<div class="kpi-cat${isOpen ? ' open' : ''}" data-cat-idx="${ci}">
      <div class="kpi-cat-head" onclick="kpiToggleCat(${ci})">
        <span class="kpi-cat-chev">▶</span>
        <div>
          <div class="kpi-cat-title">${escapeHtml(cat.title)}</div>
        </div>
        ${trendChipFor(ci) || '<span></span>'}
        <div class="kpi-cat-score"><span data-anim-key="cat-score-${ci}" data-count-to="${(+cat.subtotal).toFixed(cat.subtotal % 1 ? 1 : 0)}">${(+cat.subtotal).toFixed(cat.subtotal % 1 ? 1 : 0)}</span><span class="kpi-score-max"> / ${cat.maxSubtotal}</span></div>
        <div class="kpi-cat-bar-wrap"><div class="kpi-cat-bar kpi-band-${band.n}" style="width:${pct.toFixed(1)}%" data-fill-to="${pct.toFixed(1)}%" data-anim-key="cat-bar-${ci}"></div></div>
      </div>
      <div class="kpi-cat-body">${metricRows}</div>
    </div>`;
  }).join('');

  return `${header}<div class="kpi-cat-list">${catList}</div>`;
}

// ── Trends view = PAIRWISE QUARTER COMPARISON ────────────────────────────
// Pick a "from" and a "to" quarter; the tab becomes a scannable "what
// changed" report — per-category before/after mini-gauges, status chips,
// and auto-generated phrases, grouped + sorted worst-first so problem
// areas surface instantly. No chart (removed — it didn't communicate well).

// Classify one category's from→to movement into a status, a priority
// "concern" score (higher = worse, sorts to top in worst-first), and a
// plain-English phrase. Thresholds: low = <40% of max at the "to" quarter;
// sharp drop = lost ≥15% of max; critical = both.
function _kpiClassifyCmp(r) {
  const lowNow    = r.toPct < 40;
  const sharpDrop = r.deltaPct <= -15;
  const declined  = r.delta < -0.5;
  const improved  = r.delta > 0.5;
  const level = r.toPct < 20 ? 'critical' : r.toPct < 40 ? 'weak'
              : r.toPct < 60 ? 'solid'    : r.toPct < 80 ? 'strong' : 'outstanding';

  let status, statusLabel;
  if (lowNow && sharpDrop)      { status = 'critical';  statusLabel = 'Critical'; }
  else if (lowNow || sharpDrop) { status = 'attention'; statusLabel = 'Needs attention'; }
  else if (declined)            { status = 'regressed'; statusLabel = 'Slipped'; }
  else if (improved)            { status = 'improved';  statusLabel = 'Improved'; }
  else                          { status = 'steady';    statusLabel = 'Steady'; }
  // Celebrate genuinely strong, non-declining areas.
  if ((level === 'strong' || level === 'outstanding') && !declined && status !== 'critical' && status !== 'attention') {
    status = 'strong'; statusLabel = (level === 'outstanding' ? 'Outstanding' : 'Strong');
  }

  // Concern score — drives worst-first sort.
  let concern = (100 - r.toPct);
  if (r.delta < 0) concern += Math.abs(r.deltaPct) * 1.5;
  if (status === 'critical')  concern += 1000;
  else if (status === 'attention') concern += 500;

  // Phrase = trend clause + level clause + (priority nudge).
  const dabs = Math.abs(r.delta).toFixed(1);
  const trendClause =
      r.deltaPct >= 15  ? `Surged +${r.delta.toFixed(1)} pts`
    : improved          ? `Improved +${r.delta.toFixed(1)} pts`
    : r.deltaPct <= -15 ? `Dropped sharply −${dabs} pts`
    : declined          ? `Slipped −${dabs} pts`
    :                     `Held steady`;
  const levelClause = {
    critical:    'now at a critical low',
    weak:        'now in the weak range',
    solid:       'now at a solid level',
    strong:      'and still strong',
    outstanding: 'and outstanding'
  }[level];
  let phrase = `${trendClause} — ${levelClause}.`;
  if (status === 'critical')        phrase += ' Top priority to address.';
  else if (status === 'attention' && lowNow && !sharpDrop) phrase += ' A persistent weak spot worth a focused push.';
  else if (status === 'attention' && sharpDrop) phrase += ' Watch this closely next quarter.';

  return Object.assign({}, r, { level, status, statusLabel, concern, phrase });
}

function _renderKpiTrends(m) {
  const allKeys = _kpiSortedKeys(m);            // chronological ascending
  if (allKeys.length < 2) return '';

  // Defaults: earliest → latest (full arc). Re-validate stored picks in case
  // the underlying data was deleted since the last render. (The From→To
  // selectors themselves live in the toolbar — built in renderKpiSection —
  // so this body only renders the verdict + comparison cards.)
  if (!_kpiCmpFrom || !allKeys.includes(_kpiCmpFrom)) _kpiCmpFrom = allKeys[0];
  if (!_kpiCmpTo   || !allKeys.includes(_kpiCmpTo))   _kpiCmpTo   = allKeys[allKeys.length - 1];

  const labelFor = (key) => { const [y, q] = key.split('-Q'); return `Q${q} ${y}`; };

  if (_kpiCmpFrom === _kpiCmpTo) {
    return `<div class="kpi-cmp-hint">Pick two different quarters to compare.</div>`;
  }

  const fromData = m.kpi[_kpiCmpFrom];
  const toData   = m.kpi[_kpiCmpTo];

  // Per-category comparison records (driven by the "to" quarter's category
  // list, matched positionally to the "from" quarter).
  let cats = (toData.categories || []).map((c, i) => {
    const fromCat = (fromData.categories || [])[i] || {};
    const max   = c.maxSubtotal || fromCat.maxSubtotal || 25;
    const fromV = fromCat.subtotal != null ? fromCat.subtotal : 0;
    const toV   = c.subtotal != null ? c.subtotal : 0;
    const delta = +(toV - fromV).toFixed(2);
    const toPct = _kpiPercent(toV, max);
    const deltaPct = max ? (delta / max) * 100 : 0;
    return _kpiClassifyCmp({ title: c.title, max, fromV, toV, delta, toPct, deltaPct });
  });

  // Sort by concern. Worst-first = descending concern; flip for best-first.
  cats.sort((a, b) => _kpiCmpSort === 'worst' ? b.concern - a.concern : a.concern - b.concern);

  // Overall figures for the verdict banner.
  const oMax  = toData.meta.overallMax || 100;
  const oFrom = fromData.meta.overall || 0;
  const oTo   = toData.meta.overall || 0;
  const oDelta = +(oTo - oFrom).toFixed(1);

  const improvedCount  = cats.filter(c => c.delta > 0.5).length;
  const regressedCount = cats.filter(c => c.delta < -0.5).length;
  const attentionCount = cats.filter(c => c.status === 'critical' || c.status === 'attention').length;
  const criticalCount  = cats.filter(c => c.status === 'critical').length;

  // Verdict tone. Red = the OVERALL score declined (the headline bad news).
  // Amber = overall held/improved but there are problem areas to flag.
  // Green = improved with nothing flagged. (A critical category still shows
  // up loudly via its red card + the red "need attention" sub-text, so amber
  // here isn't burying it — it just keeps the banner honest about the net.)
  let vClass, vIcon;
  if (oDelta < -0.5)                                          { vClass = 'bad';   vIcon = '🔻'; }
  else if (criticalCount > 0 || regressedCount > 0 || attentionCount > 0) { vClass = 'mixed'; vIcon = '⚠️'; }
  else                                                        { vClass = 'good';  vIcon = '📈'; }

  const headline = oDelta > 0.5
      ? `Overall improved <strong>+${oDelta.toFixed(1)} pts</strong> (${oFrom} → ${oTo} of ${oMax})`
      : oDelta < -0.5
      ? `Overall declined <strong>−${Math.abs(oDelta).toFixed(1)} pts</strong> (${oFrom} → ${oTo} of ${oMax})`
      : `Overall held steady (${oTo} of ${oMax})`;
  const countBits = [
    improvedCount  ? `${improvedCount} improved`   : null,
    regressedCount ? `${regressedCount} regressed` : null,
    attentionCount ? `<strong style="color:#c0392b">${attentionCount} need${attentionCount > 1 ? '' : 's'} attention</strong>` : null
  ].filter(Boolean).join(' · ');
  const verdict = `<div class="kpi-verdict ${vClass}">
    <div class="kpi-verdict-icon">${vIcon}</div>
    <div>
      <div class="kpi-verdict-text">${headline} between <strong>${escapeHtml(labelFor(_kpiCmpFrom))}</strong> and <strong>${escapeHtml(labelFor(_kpiCmpTo))}</strong>.</div>
      ${countBits ? `<div class="kpi-verdict-sub">${countBits}.</div>` : ''}
    </div>
  </div>`;

  // Card render helpers.
  const pairKey = _kpiCmpFrom + '->' + _kpiCmpTo;   // note key for this comparison
  const statusIcon = (s) => ({ critical:'🔴', attention:'🟠', regressed:'📉', improved:'📈', steady:'➖', strong:'🌟' }[s] || '');
  const dirCls   = (d) => d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
  const dirColor = (d) => d > 0.5 ? '#27ae60' : d < -0.5 ? '#c0392b' : 'var(--mid)';
  const card = (c) => `<div class="kpi-cmp-card s-${c.status}">
    <div class="kpi-cmp-card-main">
      <div class="kpi-cmp-card-head">
        <span class="kpi-cmp-card-title">${escapeHtml(c.title)}</span>
        <span class="kpi-cmp-chip s-${c.status}">${statusIcon(c.status)} ${escapeHtml(c.statusLabel)}</span>
      </div>
      <div class="kpi-cmp-phrase">${c.phrase}</div>
    </div>
    <div class="kpi-cmp-gauges">
      <div class="kpi-cmp-gauge">${_kpiMiniGauge(c.fromV, c.max)}<div class="kpi-cmp-gauge-q">${escapeHtml(labelFor(_kpiCmpFrom))}</div></div>
      <div class="kpi-cmp-mid">
        <span style="color:${dirColor(c.delta)}" data-arrow-dir="${dirCls(c.delta)}">${_kpiArrowIcon(c.delta, 18)}</span>
        <div class="kpi-cmp-mid-delta ${dirCls(c.delta)}">${c.delta > 0 ? '+' : c.delta < 0 ? '−' : ''}${Math.abs(c.delta).toFixed(1)}</div>
      </div>
      <div class="kpi-cmp-gauge">${_kpiMiniGauge(c.toV, c.max)}<div class="kpi-cmp-gauge-q">${escapeHtml(labelFor(_kpiCmpTo))}</div></div>
    </div>
    ${_kpiNotesBlock(m, pairKey, c.title)}
  </div>`;

  // Walk the sorted list; insert a group divider whenever the bucket changes
  // (buckets respect the current sort direction automatically).
  const bucketOf = (c) =>
      (c.status === 'critical' || c.status === 'attention') ? 'attention'
    : c.status === 'regressed' ? 'regressed'
    : c.status === 'steady'    ? 'steady' : 'well';
  const bucketLabel = {
    attention: '🔴 Needs attention',
    regressed: '📉 Slipped',
    steady:    '➖ Held steady',
    well:      '📈 Doing well'
  };
  let listHtml = '', lastBucket = null;
  for (const c of cats) {
    const b = bucketOf(c);
    if (b !== lastBucket) { listHtml += `<div class="kpi-cmp-group-label">${bucketLabel[b]}</div>`; lastBucket = b; }
    listHtml += card(c);
  }

  return `${verdict}<div class="kpi-cmp-list">${listHtml}</div>`;
}

// ── KPI viewer modal ─────────────────────────────────────────────────────
// The KPI report lives in its own modal layered above the team profile so
// it has the screen real estate it needs and doesn't fight the profile
// editor. The profile detail just hosts a "📊 Open KPI Report" button.

// Currently-viewed member id. While the overlay is open, all KPI actions
// (year/quarter/subview/expand/upload) re-render this modal — not the
// profile. The team profile underneath remains untouched.
let _kpiViewingMemberId = null;

// Open the KPI viewer for the profile currently open (or an explicit id).
// Privacy is enforced again here as defense-in-depth — the launcher button
// is also gated on canViewKpi but a programmatic call shouldn't bypass.
function openKpiViewer(memberId) {
  const id = memberId || editingTmId;
  if (!id) return;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m) return;
  if (!canViewKpi(m)) { showToast("You don't have access to this KPI."); return; }
  _kpiViewingMemberId = id;
  renderKpiViewer();
  document.getElementById('kpi-overlay').classList.add('open');
}

function closeKpiViewer() {
  document.getElementById('kpi-overlay').classList.remove('open');
  _kpiViewingMemberId = null;
}
function maybeCloseKpi(e) { if (_shouldCloseOverlay(e, 'kpi-overlay')) closeKpiViewer(); }

// Render (or re-render) the modal contents. Reads the latest member data
// from TEAM_DIRECTORY in case Firebase pushed an update while the modal
// was open. Falls back to _tmDraft if the member id matches the open
// profile (so unsaved profile edits like uploaded KPI are reflected).
function renderKpiViewer() {
  if (!_kpiViewingMemberId) return;
  let m = (TEAM_DIRECTORY || []).find(x => x.id === _kpiViewingMemberId);
  if (_tmDraft && _tmDraft.id === _kpiViewingMemberId) m = _tmDraft;
  if (!m) { closeKpiViewer(); return; }

  // Header: avatar + name + slack/projects subtitle.
  const av = document.getElementById('kpi-modal-avatar');
  const nm = document.getElementById('kpi-modal-name');
  const sb = document.getElementById('kpi-modal-sub');
  if (av) av.innerHTML = m.image
    ? `<img src="${escAttr(m.image)}" alt=""/>`
    : defaultPersonIconSvg(28);
  if (nm) nm.textContent = (m.realName || 'Team Member') + ' · KPI Report';
  if (sb) {
    const slack = m.slackName ? '@' + String(m.slackName).replace(/^@/, '') : '';
    const projects = (m.projects || []).slice(0, 3).join(', ');
    sb.textContent = [slack, projects].filter(Boolean).join('  ·  ');
  }
  // Body: reuse the existing renderKpiSection() output. The function
  // returns an empty string for non-viewers, but we already gated via
  // canViewKpi above, so we expect a non-empty section here.
  const body = document.getElementById('kpi-modal-body');
  if (body) {
    body.innerHTML = renderKpiSection(m);
    // Run the open/refresh animations, then reset the mode to the default.
    // Handlers that shouldn't replay everything (drill-in, note editing) set
    // _kpiAnimMode/_kpiAnimCat just before calling renderKpiViewer.
    const mode = _kpiAnimMode, cat = _kpiAnimCat;
    _kpiAnimMode = 'full'; _kpiAnimCat = null;
    _kpiRunAnimations(body, mode, cat);
  }
}

// ── KPI animations ───────────────────────────────────────────────────────
// Everything is rendered at its FINAL value in the HTML, so reduced-motion /
// no-JS still shows correct numbers. These helpers reset an element to its
// "empty/zero" state and transition it back to final for a satisfying
// fill / count-up / arrow-bounce on open.
let _kpiAnimMode = 'full';   // 'full' | 'drillin' | 'none'
let _kpiAnimCat  = null;     // category index for 'drillin'

function _kpiReducedMotion() {
  try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch(e) { return false; }
}
function _kpiCountUp(el, carry) {
  const tgt = parseFloat(el.getAttribute('data-count-to'));
  if (!isFinite(tgt)) return;
  const dec = (String(el.getAttribute('data-count-to')).indexOf('.') >= 0) ? 1 : 0;
  // Carry-over: count FROM the previously-displayed value for this element
  // (so the number ticks up OR down to the new quarter's value) when we have
  // a remembered value; otherwise count up from 0.
  const key = el.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : 0;
  if (key) _kpiLastAnim[key] = tgt;
  const dur = 750;
  let t0 = null;
  const step = (ts) => {
    if (t0 === null) t0 = ts;
    const t = Math.min(1, (ts - t0) / dur);
    const eased = 1 - Math.pow(1 - t, 3);   // easeOutCubic
    el.textContent = (from + (tgt - from) * eased).toFixed(dec);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = tgt.toFixed(dec);
  };
  requestAnimationFrame(step);
}
// NOTE on technique: CSS transitions on SVG paint properties (stroke-
// dashoffset) proved unreliable to (re)trigger after innerHTML replacement —
// they stall at the start value. So we JS-tween every value frame-by-frame
// with requestAnimationFrame (the same mechanism the count-up uses, which is
// rock-solid here). easeOutCubic gives a quick-then-settle feel.
function _kpiTween(setFn, from, to, dur) {
  dur = dur || 800;
  let t0 = null, done = false;
  const finish = () => { if (done) return; done = true; setFn(to); };
  const step = (ts) => {
    if (done) return;
    if (t0 === null) t0 = ts;
    const t = Math.min(1, (ts - t0) / dur);
    const eased = 1 - Math.pow(1 - t, 3);   // easeOutCubic
    setFn(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
    else finish();
  };
  requestAnimationFrame(step);
  // Safety net: if rAF is starved (backgrounded / headless tab that isn't
  // painting), still land on the final value so content is never left stuck
  // in its reset/empty state. In a normal foreground tab rAF finishes first
  // and this becomes a no-op.
  setTimeout(finish, dur + 250);
}
function _kpiAnimGauge(circle, carry) {
  const off = parseFloat(circle.getAttribute('data-off'));
  const circ = parseFloat(circle.getAttribute('data-circ'));
  if (!isFinite(off) || !isFinite(circ)) return;
  // Carry-over: start the ring from the previously-displayed offset (so it
  // visibly grows or shrinks toward the new quarter's value) when remembered;
  // otherwise start from empty (full circumference).
  const key = circle.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : circ;
  if (key) _kpiLastAnim[key] = off;
  // Drive the SVG presentation attribute directly — assigning a raw number to
  // circle.style.strokeDashoffset silently fails in some engines, whereas
  // setAttribute is reliable for SVG.
  _kpiTween(v => { circle.setAttribute('stroke-dashoffset', v.toFixed(2)); }, from, off, 850);
}
function _kpiAnimFill(el, carry) {
  const w = parseFloat(el.getAttribute('data-fill-to'));   // "100.0%" → 100
  if (!isFinite(w)) return;
  const key = el.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : 0;
  if (key) _kpiLastAnim[key] = w;
  el.style.transition = 'none';
  _kpiTween(v => { el.style.width = v + '%'; }, from, w, 700);
}
// Animate a 5-pip bar as ONE continuous bar sweeping left→right. A single
// value tweens from→rating; each frame distributes it across the pips
// (pip i fills as the value passes i), so the fill front moves through pip 1,
// then 2, then 3… rather than every pip filling at once. With carry-over the
// "from" is the previous quarter's rating so a metric visibly rises or falls.
function _kpiAnimPipBar(barEl, carry) {
  const rating = parseFloat(barEl.getAttribute('data-pip-rating'));
  if (!isFinite(rating)) return;
  const key = barEl.getAttribute('data-anim-key');
  const from = (carry && key && _kpiLastAnim[key] != null) ? _kpiLastAnim[key] : 0;
  if (key) _kpiLastAnim[key] = rating;
  const fills = barEl.querySelectorAll('.kpi-pip-fill');
  // Don't reset width synchronously — let the tween's first frame set the
  // start distribution. That way, if rAF never fires the pips simply stay at
  // their rendered final widths instead of getting stuck empty.
  fills.forEach(f => { f.style.transition = 'none'; });
  _kpiTween(v => {
    fills.forEach((f, idx) => {
      const frac = Math.max(0, Math.min(1, v - idx));
      f.style.width = (frac * 100).toFixed(1) + '%';
    });
  }, from, rating, 700);
}
function _kpiAnimArrow(el) {
  const dir = el.getAttribute('data-arrow-dir') || 'flat';
  el.classList.remove('kpi-anim-arrow', 'up', 'down', 'flat');
  void el.getBoundingClientRect();
  el.classList.add('kpi-anim-arrow', dir);
}
function _kpiRunAnimations(root, mode, openCatIdx) {
  if (!root || mode === 'none' || _kpiReducedMotion()) return;
  if (mode === 'drillin') {
    // Only the just-expanded category's pip bars animate — no full-page replay.
    // carry=false: a freshly-revealed drill-in sweeps from empty (it's a
    // reveal within the SAME quarter, not a quarter-to-quarter change).
    const cat = root.querySelector('.kpi-cat.open[data-cat-idx="' + openCatIdx + '"]');
    if (cat) cat.querySelectorAll('.kpi-pip-bar[data-pip-rating]').forEach(b => _kpiAnimPipBar(b, false));
    return;
  }
  // 'full' — animate everything currently visible. carry=true so gauges/bars/
  // numbers/pips animate FROM the previously-displayed value (visible up/down)
  // when one is remembered, else from 0/empty (first open).
  root.querySelectorAll('[data-kpi-gauge]').forEach(c => _kpiAnimGauge(c, true));
  root.querySelectorAll('.kpi-cat-bar[data-fill-to]').forEach(e => _kpiAnimFill(e, true));
  root.querySelectorAll('.kpi-cat.open .kpi-pip-bar[data-pip-rating]').forEach(b => _kpiAnimPipBar(b, true));
  root.querySelectorAll('[data-count-to]').forEach(e => _kpiCountUp(e, true));
  root.querySelectorAll('[data-arrow-dir]').forEach(_kpiAnimArrow);
}

// ── KPI interaction handlers ─────────────────────────────────────────────
// All handlers re-render the KPI VIEWER (not the profile underneath) so
// state changes are localized to the open modal.
function kpiSelectYear(y)    { _kpiYear = parseInt(y, 10); _kpiQuarter = null; renderKpiViewer(); }
function kpiSelectQuarter(q) { _kpiQuarter = q; renderKpiViewer(); }
function kpiSetSubview(v)    { _kpiSubview = v; renderKpiViewer(); }
function kpiToggleCat(i) {
  const opening = !_kpiOpenCats.has(i);
  if (opening) _kpiOpenCats.add(i); else _kpiOpenCats.delete(i);
  // Drill-in: animate only the newly-revealed pip bars, not the whole page.
  _kpiAnimMode = 'drillin'; _kpiAnimCat = i;
  renderKpiViewer();
}
function kpiPrint() { window.print(); }

// Trends pairwise-comparison handlers.
function kpiCmpSetFrom(key) { _kpiCmpFrom = key; renderKpiViewer(); }
function kpiCmpSetTo(key)   { _kpiCmpTo = key;   renderKpiViewer(); }
function kpiCmpToggleSort() { _kpiCmpSort = (_kpiCmpSort === 'worst' ? 'best' : 'worst'); renderKpiViewer(); }

// ── Coaching notes (admin-authored, owner+admin viewable) ────────────────
// Notes are tied to the exact From→To comparison pair AND category title.
// Multiple notes stack per (pair, category), each timestamped. Admin can
// add/edit/delete; non-admins only see existing notes.
function _kpiFmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch(e) { return ''; }
}
function _kpiNoteMember() {
  // The member being viewed. Mutating its kpiNotes + saveTeamOnly() persists
  // and syncs. Keep _tmDraft pointing at the same kpiNotes object so both
  // render sources agree.
  const id = _kpiViewingMemberId;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m) return null;
  if (!m.kpiNotes || typeof m.kpiNotes !== 'object') m.kpiNotes = {};
  if (_tmDraft && _tmDraft.id === id) _tmDraft.kpiNotes = m.kpiNotes;
  return m;
}
function _kpiNotesFor(m, pair, cat) {
  return (m && m.kpiNotes && m.kpiNotes[pair] && m.kpiNotes[pair][cat]) || [];
}
// Inner-key for per-metric coaching notes. Notes for metrics live under the
// QUARTER scope key (e.g. "2026-Q1", which never contains "->" so it can't
// collide with the Trends pair keys), with this composite category|||metric
// inner key. The whole coaching-note machinery (_kpiNotesBlock + handlers) is
// generic over (outerKey, innerKey), so metrics reuse it unchanged.
function _kpiMetricNoteKey(catTitle, metricTitle) { return catTitle + ' ||| ' + metricTitle; }

// Seed CSV per-metric comments as the first coaching note for each metric on
// upload. Seeded notes carry `seeded:true`. To avoid duplicating on re-upload
// we drop any prior STILL-seeded note for the metric and re-seed from the new
// CSV; admin-authored notes (and seeds the admin later edited — see kpiNoteSave
// which clears the flag on edit) are preserved.
function _kpiSeedMetricNotes(member, scopeKey, data) {
  if (!member.kpiNotes || typeof member.kpiNotes !== 'object') member.kpiNotes = {};
  if (!member.kpiNotes[scopeKey]) member.kpiNotes[scopeKey] = {};
  const bucket = member.kpiNotes[scopeKey];
  for (const cat of (data.categories || [])) {
    for (const met of (cat.metrics || [])) {
      const nk = _kpiMetricNoteKey(cat.title, met.title);
      const kept = (bucket[nk] || []).filter(n => !n.seeded);   // keep manual/edited
      const comment = (met.comment || '').trim();
      if (comment) {
        kept.unshift({ id: 'note-seed-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), text: comment, ts: Date.now(), seeded: true });
      }
      if (kept.length) bucket[nk] = kept; else delete bucket[nk];
    }
  }
}

// Returns the notes block HTML for a comparison card OR a metric. Empty string
// when a non-admin has no notes to show (so the card stays clean).
function _kpiNotesBlock(m, pair, cat) {
  const notes = _kpiNotesFor(m, pair, cat);
  const editing = _kpiNoteEdit && _kpiNoteEdit.pair === pair && _kpiNoteEdit.cat === cat;
  const pj = escJsAttr(pair), cj = escJsAttr(cat);
  let inner = '';

  for (const n of notes) {
    if (editing && _kpiNoteEdit.id === n.id) {
      inner += `<div class="kpi-note editing">
        <textarea class="form-textarea" id="kpi-note-input" rows="3" placeholder="Coaching note…">${escapeHtml(n.text)}</textarea>
        <div class="kpi-note-actions">
          <button class="btn btn-secondary" onclick="kpiNoteCancel()">Cancel</button>
          <button class="btn btn-primary" onclick="kpiNoteSave('${pj}','${cj}','${escJsAttr(n.id)}')">Save</button>
        </div>
      </div>`;
    } else {
      inner += `<div class="kpi-note">
        <div class="kpi-note-head">
          <span class="kpi-note-badge">📝 Coaching note</span>
          <span class="kpi-note-date">${escapeHtml(_kpiFmtDate(n.ts))}</span>
          ${isAdminMode ? `<span class="kpi-note-tools">
            <button class="kpi-note-tool" title="Edit note" onclick="kpiNoteStartEdit('${pj}','${cj}','${escJsAttr(n.id)}')">✎</button>
            <button class="kpi-note-tool danger" title="Delete note" onclick="kpiNoteDelete('${pj}','${cj}','${escJsAttr(n.id)}')">🗑</button>
          </span>` : ''}
        </div>
        <div class="kpi-note-text">${escapeHtml(n.text)}</div>
      </div>`;
    }
  }

  if (isAdminMode) {
    if (editing && _kpiNoteEdit.id === null) {
      inner += `<div class="kpi-note editing">
        <textarea class="form-textarea" id="kpi-note-input" rows="3" placeholder="How can they pull this up coming into the next quarter?"></textarea>
        <div class="kpi-note-actions">
          <button class="btn btn-secondary" onclick="kpiNoteCancel()">Cancel</button>
          <button class="btn btn-primary" onclick="kpiNoteSave('${pj}','${cj}','')">Add note</button>
        </div>
      </div>`;
    } else if (!editing) {
      inner += `<button class="kpi-note-add" onclick="kpiNoteStartAdd('${pj}','${cj}')">＋ Add coaching note</button>`;
    }
  }

  if (!inner) return '';   // non-admin, no notes → render nothing
  return `<div class="kpi-cmp-notes">${inner}</div>`;
}
function _kpiFocusNoteInput() {
  setTimeout(() => {
    const t = document.getElementById('kpi-note-input');
    if (t) { t.focus(); try { t.setSelectionRange(t.value.length, t.value.length); } catch(e){} }
  }, 60);
}
function kpiNoteStartAdd(pair, cat)  { _kpiNoteEdit = { pair, cat, id: null }; _kpiAnimMode = 'none'; renderKpiViewer(); _kpiFocusNoteInput(); }
function kpiNoteStartEdit(pair, cat, id) { _kpiNoteEdit = { pair, cat, id }; _kpiAnimMode = 'none'; renderKpiViewer(); _kpiFocusNoteInput(); }
function kpiNoteCancel() { _kpiNoteEdit = null; _kpiAnimMode = 'none'; renderKpiViewer(); }
function kpiNoteSave(pair, cat, id) {
  if (!isAdminMode) return;
  const ta = document.getElementById('kpi-note-input');
  const text = ta ? ta.value.trim() : '';
  if (!text) { _kpiNoteEdit = null; _kpiAnimMode = 'none'; renderKpiViewer(); return; }
  const m = _kpiNoteMember();
  if (!m) return;
  if (!m.kpiNotes[pair]) m.kpiNotes[pair] = {};
  if (!m.kpiNotes[pair][cat]) m.kpiNotes[pair][cat] = [];
  const arr = m.kpiNotes[pair][cat];
  if (id) {
    const n = arr.find(x => x.id === id);
    if (n) {
      n.text = text;                 // keep original timestamp on edit
      delete n.seeded;               // an edited seed becomes an admin-owned note (won't be re-seeded on re-upload)
    }
  } else {
    arr.push({ id: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), text, ts: Date.now() });
  }
  saveTeamOnly();
  _kpiNoteEdit = null;
  _kpiAnimMode = 'none';
  renderKpiViewer();
  showToast(id ? 'Coaching note updated' : 'Coaching note added');
}
async function kpiNoteDelete(pair, cat, id) {
  if (!isAdminMode) return;
  if (!await customConfirm('Delete this coaching note? This cannot be undone.', { danger: true, confirmLabel: 'Delete note' })) return;
  const m = _kpiNoteMember();
  if (!m || !m.kpiNotes[pair] || !m.kpiNotes[pair][cat]) return;
  m.kpiNotes[pair][cat] = m.kpiNotes[pair][cat].filter(x => x.id !== id);
  saveTeamOnly();
  _kpiAnimMode = 'none';
  renderKpiViewer();
  showToast('Coaching note deleted');
}

// ── Admin delete-quarter action ──────────────────────────────────────────
// Removes the KPI record for the currently-viewed quarter. Used when the
// wrong CSV was uploaded. Confirmation modal shows the year/quarter and
// member name so the admin doesn't fat-finger the wrong record.
async function kpiDeleteQuarter() {
  if (!isAdminMode) return;
  if (!_tmDraft) return;
  const key = _scopeKey(_kpiYear, _kpiQuarter);
  const existing = _tmDraft.kpi && _tmDraft.kpi[key];
  if (!existing) return;

  const who = _tmDraft.realName || _tmDraft.slackName || 'this team member';
  const ok = await customConfirm(
    `Delete the Q${_kpiQuarter} ${_kpiYear} KPI record for ${who}?\n\n` +
    `Overall score on file: ${existing.meta?.overall ?? '?'} / ${existing.meta?.overallMax ?? '?'}.\n` +
    `This cannot be undone — you'll need to re-upload the correct CSV to restore.`,
    { danger: true, confirmLabel: 'Delete this quarter' }
  );
  if (!ok) return;

  // Wipe from the open draft AND the directory; persist immediately.
  delete _tmDraft.kpi[key];
  const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
  if (idx >= 0 && TEAM_DIRECTORY[idx].kpi) {
    delete TEAM_DIRECTORY[idx].kpi[key];
    saveTeamOnly();
  }
  // Re-render. If the deleted quarter was the only one on record, the
  // section auto-falls-back to the empty state. The currently-selected
  // quarter is preserved so the admin can see "now missing" feedback.
  if (document.getElementById('kpi-overlay').classList.contains('open')) renderKpiViewer();
  else renderTmDetail();
  showToast(`Deleted Q${_kpiQuarter} ${_kpiYear} record.`);
}

// ── Admin upload flow ────────────────────────────────────────────────────
async function kpiUploadStart() {
  if (!isAdminMode) return;
  if (!_tmDraft) return;
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.csv,text/csv';
  inp.onchange = async ev => {
    const file = ev.target.files[0];
    if (!file) return;
    let text = '';
    try { text = await file.text(); }
    catch(e) { alert('Could not read the file: ' + e.message); return; }

    const parsed = parseKpiCsv(text);
    if (!parsed.ok) { alert('Cannot use this CSV.\n\n' + parsed.error); return; }

    const meta = parsed.data.meta;
    const key = meta.scope.key;

    // Name match guard — refuse to upload someone else's CSV to this profile.
    // Comparison is case-insensitive and collapses internal whitespace so
    // "John  Smith" still matches "john smith". Skipped silently when either
    // side is empty (the parser already ensures Name is present, but profiles
    // without a Real Name don't trigger the check).
    const _norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const csvName = _norm(meta.name);
    const memberName = _norm(_tmDraft.realName);
    if (csvName && memberName && csvName !== memberName) {
      alert(
        'This CSV is for "' + (meta.name || '?') + '" but you are uploading it to ' +
        (_tmDraft.realName || '(unnamed profile)') + "'s profile.\n\n" +
        'The Real Name on the profile must match the Name field in the CSV. Please verify you have the right CSV for the right person.'
      );
      return;
    }

    // Future-quarter block (defense in depth — UI hides future tabs anyway).
    if (_isFutureQuarter(meta.scope.year, meta.scope.quarter)) {
      alert(`Q${meta.scope.quarter} ${meta.scope.year} hasn't happened yet. You can only upload data for the current or past quarters.`);
      return;
    }

    // Overwrite confirmation if data already exists for this scope.
    const existing = _tmDraft.kpi[key];
    if (existing) {
      const ok = await customConfirm(
        `Overwrite the existing ${key} record? The current overall score is ${existing.meta?.overall ?? '?'}/${existing.meta?.overallMax ?? '?'}; the new CSV says ${meta.overall}/${meta.overallMax}.`,
        { danger: true, confirmLabel: 'Replace' }
      );
      if (!ok) return;
    } else {
      const ok = await customConfirm(
        `Upload ${key} for ${escapeHtml(meta.name || m.realName)}? Overall: ${meta.overall}/${meta.overallMax} (${escapeHtml(meta.overallLabel || '')}).`,
        { confirmLabel: 'Upload' }
      );
      if (!ok) return;
    }

    // Commit to draft AND directory (immediate persistence — admin doesn't
    // need to also click "Save" to seal the KPI upload).
    _tmDraft.kpi[key] = parsed.data;
    const idx = (TEAM_DIRECTORY || []).findIndex(x => x.id === editingTmId);
    if (idx >= 0) {
      if (!TEAM_DIRECTORY[idx].kpi || typeof TEAM_DIRECTORY[idx].kpi !== 'object') TEAM_DIRECTORY[idx].kpi = {};
      TEAM_DIRECTORY[idx].kpi[key] = parsed.data;
      // Seed each metric's CSV comment as its first coaching note (de-duped).
      _kpiSeedMetricNotes(TEAM_DIRECTORY[idx], key, parsed.data);
      _tmDraft.kpiNotes = TEAM_DIRECTORY[idx].kpiNotes;   // keep the draft in sync
      saveTeamOnly();
    } else {
      // No directory entry (shouldn't normally happen) — seed on the draft.
      _kpiSeedMetricNotes(_tmDraft, key, parsed.data);
    }
    // Jump straight to the newly-uploaded quarter so the admin sees the result.
    _kpiYear = meta.scope.year;
    _kpiQuarter = meta.scope.quarter;
    _kpiSubview = 'quarter';
    // Re-render whichever surface is currently visible — the dedicated KPI
    // viewer if open (typical path now), otherwise fall back to the inline
    // profile re-render (in case kpiUploadStart is ever called from there).
    if (document.getElementById('kpi-overlay').classList.contains('open')) renderKpiViewer();
    else renderTmDetail();
    showToast(`KPI uploaded: ${key}`);
  };
  inp.click();
}

function addTmProject(value) {
  const v = (value || '').trim();
  if (!v) return;
  if (!_tmDraft.projects) _tmDraft.projects = [];
  if (_tmDraft.projects.includes(v)) return;
  _tmDraft.projects.push(v);
  renderTmDetail();
  setTimeout(() => { const inp = document.getElementById('tm-project-input'); if (inp) inp.focus(); }, 30);
}
function removeTmProject(i) {
  if (!_tmDraft.projects) return;
  _tmDraft.projects.splice(i, 1);
  renderTmDetail();
}

function uploadTmImage() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async ev => {
    const file = ev.target.files[0]; if (!file) return;
    if (file.size > AVATAR_MAX_BYTES) {
      alert(`Avatar is too large (${(file.size/1024/1024).toFixed(2)} MB). Maximum allowed is 1 MB.`);
      return;
    }
    try {
      const originalUrl = await fileToDataUrl(file);
      // Auto-resize to fit AVATAR_MAX_DIM × AVATAR_MAX_DIM
      const resized = await resizeImage(originalUrl, AVATAR_MAX_DIM, file.type);
      _tmDraft.image = resized;
      renderTmDetail();
    } catch(err) {
      alert('Could not process image: ' + err.message);
    }
  };
  inp.click();
}
function clearTmImage() { _tmDraft.image = ''; renderTmDetail(); }

function saveTm() {
  // Permission check (defense in depth — UI hides the Save button for viewers
  // who can't edit, but make sure a programmatic call can't bypass).
  if (editingTmId) {
    const existing = (TEAM_DIRECTORY || []).find(x => x.id === editingTmId);
    if (existing && !canEditTm(existing)) {
      alert('You can only edit your own profile (or sign in as admin).');
      return;
    }
  }
  // Pull in-edit-mode values from inputs into draft
  if (tmEditMode) {
    const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    _tmDraft.slackName     = get('tm-slackName');
    _tmDraft.realName      = get('tm-realName');
    _tmDraft.expertise     = get('tm-expertise');
    _tmDraft.artStyle      = get('tm-artStyle');
    _tmDraft.favoriteGenre = get('tm-favoriteGenre');
    _tmDraft.favoriteGames = get('tm-favoriteGames');
    _tmDraft.portfolio     = get('tm-portfolio');
    _tmDraft.schedule = {
      signIn: get('tm-signIn'),
      signOut: get('tm-signOut'),
      timezone: get('tm-timezone') || 'America/New_York'
    };
    // Capture any unsubmitted text in the project input as a final chip
    const remaining = document.getElementById('tm-project-input');
    if (remaining && remaining.value.trim()) {
      addTmProject(remaining.value.trim());
      // re-capture inputs after re-render
      return saveTm();
    }
  }

  // Validation
  if (!_tmDraft.slackName) { alert('Slack Name is required.'); return; }
  if (!_tmDraft.realName) { alert('Real Name is required.'); return; }
  if (!_tmDraft.projects || _tmDraft.projects.length === 0) { alert('Please add at least one project.'); return; }

  _tmDraft._updatedAt = Date.now();

  // Track first-save (= profile creation) so we can show the one-time
  // "Save this passkey!" notice to the new owner.
  const isFirstSave = !editingTmId || !TEAM_DIRECTORY.some(m => m.id === editingTmId);

  if (editingTmId) {
    const idx = TEAM_DIRECTORY.findIndex(m => m.id === editingTmId);
    if (idx === -1) { TEAM_DIRECTORY.push(_tmDraft); }
    else { TEAM_DIRECTORY[idx] = _tmDraft; }
  } else {
    TEAM_DIRECTORY.push(_tmDraft);
    editingTmId = _tmDraft.id;
  }

  // Make sure the new profile got a passkey (blankTm() always does, but in
  // case a future code path constructs one without going through blankTm).
  if (isFirstSave && !_tmDraft.passkey) {
    const used = new Set(TEAM_DIRECTORY.map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
    do { _tmDraft.passkey = generatePasskey(); } while (used.has(_tmDraft.passkey.toUpperCase()));
  }

  saveTeamOnly();
  tmEditMode = false;

  // On profile creation: auto-sign-in the new owner so the next thing they do
  // (edit their own profile, see "their" pages) just works. Only do this if
  // nobody is currently signed in (otherwise this would hijack the session of
  // whoever opened the "Add Team Member" card — e.g. an admin onboarding a
  // teammate, where the admin should remain admin).
  if (isFirstSave && !currentUser && !isAdminMode) {
    setCurrentUser(_tmDraft, true /* stay signed in by default after creation */);
    _renderSignOutChip();
  }

  renderTmDetail();
  renderTeamRoster();
  document.getElementById('tm-detail-title').textContent = _tmDraft.realName || 'Team Member';

  // Show the one-time passkey notice AFTER persisting and re-rendering, so the
  // user sees their card already updated underneath the modal.
  if (isFirstSave) showNewProfilePasskey(_tmDraft);
}

async function deleteCurrentTm() {
  if (!editingTmId) return;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === editingTmId);
  if (!m) return;
  if (!canEditTm(m)) { alert('You can only delete your own profile (or sign in as admin).'); return; }
  if (!await customConfirm('Remove this team member profile? This cannot be undone — and the passkey will stop working.', { danger: true, confirmLabel: 'Delete profile' })) return;
  const wasSelf = currentUser && currentUser.tmId === editingTmId;
  TEAM_DIRECTORY = TEAM_DIRECTORY.filter(m => m.id !== editingTmId);
  saveTeamOnly();
  renderTeamRoster();
  closeTmDetail();
  // If the user just deleted their own profile, sign them out so they don't
  // sit on a phantom session pointing at a missing member.
  if (wasSelf) signOut();
}

// One-time "save this passkey!" notice shown right after profile creation.
// The owner sees their 8-char code in big mono, can copy it to clipboard,
// and must acknowledge before dismissing. After this they only see it again
// at creation in this same modal — admins can look it up later via the
// admin-only passkey section at the bottom of the profile.
function showNewProfilePasskey(m) {
  if (!m || !m.passkey) return;
  const overlay = document.getElementById('new-pk-overlay');
  if (!overlay) return;
  const code  = document.getElementById('new-pk-code');
  const intro = document.getElementById('new-pk-intro');
  if (code)  code.textContent  = m.passkey;
  if (intro) intro.innerHTML   = 'Profile saved for <strong>' +
    escapeHtml(m.slackName ? '@' + String(m.slackName).replace(/^@/, '') : (m.realName || 'this team member')) +
    '</strong>.';
  overlay.classList.add('open');
  // Auto-focus the Copy button so Enter copies + closes is one fast path.
  setTimeout(() => {
    const btn = document.getElementById('new-pk-copy-btn');
    if (btn) btn.focus();
  }, 80);
}
function copyNewPasskey() {
  const t = document.getElementById('new-pk-code');
  if (!t || !t.textContent) return;
  navigator.clipboard.writeText(t.textContent).then(
    () => showToast('Passkey copied — paste it somewhere safe!'),
    () => showToast('Could not copy automatically — select and copy manually.')
  );
}
function closeNewPasskey() {
  const overlay = document.getElementById('new-pk-overlay');
  if (overlay) overlay.classList.remove('open');
}

/* ── ALL PASSKEYS admin lookup ───────────────────────────────────────────
   A searchable table of every team member + their passkey, with quick copy
   and rotate buttons. Built for the "I forgot my passkey, can you help?"
   support flow — admins can grab the code and DM it back in a few seconds. */
function openAllPasskeys() {
  if (!isAdminMode) { showToast('Admin only'); return; }
  // The All Passkeys page is a focused admin workspace — close the Team
  // Directory window underneath so the user isn't stacking two related
  // panels. The 🔑 button in the team directory header is the only way in,
  // so dismissing the parent is safe and reduces visual clutter.
  closeTeamModal();
  const inp = document.getElementById('pk-filter');
  if (inp) inp.value = '';
  renderPasskeysTable();
  document.getElementById('pk-modal-overlay').classList.add('open');
  setTimeout(() => { if (inp) inp.focus(); }, 60);
}
function closeAllPasskeys() { document.getElementById('pk-modal-overlay').classList.remove('open'); }
function maybeClosePk(e)    { if (_shouldCloseOverlay(e, 'pk-modal-overlay')) closeAllPasskeys(); }

function renderPasskeysTable() {
  const wrap = document.getElementById('pk-table-wrap');
  if (!wrap) return;
  const q = (document.getElementById('pk-filter')?.value || '').trim().toLowerCase();
  const rows = (TEAM_DIRECTORY || [])
    .filter(m => m && m.id)
    .filter(m => {
      if (!q) return true;
      const hay = [m.slackName, m.realName, m.passkey, ...(m.projects || [])]
        .filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    })
    .sort((a, b) => String(a.realName || a.slackName || '').localeCompare(String(b.realName || b.slackName || '')));

  if (!rows.length) {
    wrap.innerHTML = `<div class="pk-empty">${q ? 'No matches.' : 'No team members yet.'}</div>`;
    return;
  }
  const html = `<table class="pk-table">
    <thead><tr>
      <th style="width:36px"></th>
      <th>Slack</th>
      <th>Real Name</th>
      <th>Passkey</th>
      <th style="width:1px;white-space:nowrap">Actions</th>
    </tr></thead>
    <tbody>
      ${rows.map(m => `<tr>
        <td>${m.image ? `<img class="pk-avatar" src="${escAttr(m.image)}" alt=""/>` : `<div class="pk-avatar"></div>`}</td>
        <td>${m.slackName ? escapeHtml('@' + m.slackName.replace(/^@/, '')) : '<span style="color:var(--mid)">(no slack)</span>'}</td>
        <td>${m.realName ? escapeHtml(m.realName) : '<span style="color:var(--mid)">(unnamed)</span>'}</td>
        <td><span class="pk-code">${escapeHtml(m.passkey || '—')}</span></td>
        <td><div class="pk-actions">
          <button class="pk-mini-btn" title="Copy passkey to clipboard"
                  onclick="copyPasskeyForId('${escJsAttr(m.id)}')">📋 Copy</button>
          <button class="pk-mini-btn danger" title="Rotate — old code stops working immediately"
                  onclick="rotatePasskeyForId('${escJsAttr(m.id)}')">↻ Rotate</button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table>`;
  wrap.innerHTML = html;
}

function copyPasskeyForId(id) {
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m || !m.passkey) return;
  navigator.clipboard.writeText(m.passkey).then(
    () => showToast('Passkey copied for ' + (m.slackName ? '@' + m.slackName.replace(/^@/, '') : (m.realName || 'member'))),
    () => showToast('Could not copy — select and copy manually.')
  );
}

async function rotatePasskeyForId(id) {
  if (!isAdminMode) return;
  const m = (TEAM_DIRECTORY || []).find(x => x.id === id);
  if (!m) return;
  const who = m.slackName ? '@' + m.slackName.replace(/^@/, '') : (m.realName || 'this member');
  if (!await customConfirm('Rotate passkey for ' + who + '? The old code will stop working immediately.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  const used = new Set((TEAM_DIRECTORY || []).map(x => x && x.passkey ? String(x.passkey).toUpperCase() : '').filter(Boolean));
  let next;
  do { next = generatePasskey(); } while (used.has(next.toUpperCase()));
  m.passkey = next;
  saveTeamOnly();
  // If we're rotating the open profile, keep the drafts in sync so the admin
  // sees the new value if they pop the detail open afterwards.
  if (editingTmId === id && _tmDraft) _tmDraft.passkey = next;
  // If we just rotated the CURRENT user's own passkey, refresh their session.
  if (currentUser && currentUser.tmId === id) {
    setCurrentUser(m, currentUserPersistent);
  }
  renderPasskeysTable();
  showToast('Passkey rotated');
}

/* ══════════════════════════════════════════
   IMAGE LIGHTBOX
   ══════════════════════════════════════════ */
function openLightbox(src) {
  lightboxZoom = 1;
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.style.transform = 'scale(1)';
  document.getElementById('lightbox-zoom-label').textContent = '100%';
  document.getElementById('lightbox-overlay').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
  document.getElementById('lightbox-img').src = '';
}
function maybeCloseLightbox(e) {
  if (e.target.id === 'lightbox-overlay' || e.target.id === 'lightbox-stage') closeLightbox();
}
function zoomLightbox(d) {
  lightboxZoom = Math.min(4, Math.max(0.25, lightboxZoom + d));
  document.getElementById('lightbox-img').style.transform = `scale(${lightboxZoom})`;
  document.getElementById('lightbox-zoom-label').textContent = Math.round(lightboxZoom * 100) + '%';
}
function resetLightboxZoom() { zoomLightbox(1 - lightboxZoom); }

// Delegated image click for lightbox
document.addEventListener('click', e => {
  const t = e.target;
  if (t.tagName !== 'IMG') return;
  // Skip toolbar/UI images
  if (t.closest('.rt-toolbar') || t.closest('.icon-btn') || t.closest('#lightbox-overlay')) return;
  // Trigger lightbox for content images
  if (t.closest('.entry-content') || t.closest('.dv-entry-content') || t.classList.contains('entry-img')) {
    openLightbox(t.src);
  }
});

/* ══════════════════════════════════════════
   DOCUMENTATION VIEW
   ══════════════════════════════════════════ */
function showDocView() {
  pauseInlineVideos();
  if (!isAdminMode) { showToast('Documentation View requires Admin Mode.'); return; }
  setView('docview'); updateBreadcrumb(); renderDocView();
}

function dvSetBase(base) {
  docViewBase = base;
  renderDocView();
}

function renderDocView() {
  const outline = document.getElementById('docview-outline');
  const content = document.getElementById('docview-content');
  const base = docViewBase || 'handbook';
  const sectionsArr = sectionsOf(base);
  let baseLabel = getCategoryLabel(base);
  let itemLabel = base === 'projects' ? 'Project' : 'Section';

  // Outline with base tabs for ALL kb categories
  let tabsHtml = `<button class="dv-tab${base==='handbook'?' active':''}" onclick="dvSetBase('handbook')">📘 ${escapeHtml(getCategoryLabel('handbook'))}</button>
    <button class="dv-tab${base==='projects'?' active':''}" onclick="dvSetBase('projects')">🗂 ${escapeHtml(getCategoryLabel('projects'))}</button>`;
  for (const cc of (CUSTOM_CATEGORIES || [])) {
    if (!cc || !cc.id) continue;
    tabsHtml += `<button class="dv-tab${base===cc.id?' active':''}" onclick="dvSetBase('${escJsAttr(cc.id)}')">📂 ${escapeHtml(cc.label)}</button>`;
  }
  let oh = `<div class="dv-outline-heading">Outline</div>
    <div class="dv-base-toggle" style="flex-wrap:wrap">
      ${tabsHtml}
    </div>`;
  if (sectionsArr.length === 0) {
    oh += `<div style="font-size:12px;color:var(--mid);font-style:italic;padding:8px 0">No ${baseLabel.toLowerCase()} yet.</div>`;
  }
  for (const sec of sectionsArr) {
    oh += `<div class="dv-out-parent" onclick="document.getElementById('dv-sec-${escAttr(base)}-${escAttr(sec.num)}').scrollIntoView({behavior:'smooth',block:'start'})">
      ${escapeHtml(sec.num + '. ' + sec.title)}
    </div>`;
    const entries = entriesTreeOrder(sec.num, base);
    if (entries.length) {
      oh += `<div class="dv-out-children">`;
      for (const e of entries) {
        const ind = entryDepthBelowSection(e.id) * 12;
        oh += `<div class="dv-out-child" style="padding-left:${6 + ind}px" onclick="document.getElementById('dv-en-${escAttr(base)}-${escAttr(e.id)}').scrollIntoView({behavior:'smooth',block:'start'})">${escapeHtml(e.id + ' ' + e.title)}</div>`;
      }
      oh += `</div>`;
    }
  }
  outline.innerHTML = oh;

  // Content
  let ch = `<div class="dv-title-bar">
    <div>
      <div class="dv-title">VL ${escapeHtml(baseLabel)} — Documentation View</div>
      <div class="dv-title-meta">Edit any entry inline. Changes save when you click "Save".</div>
    </div>
    <button class="btn btn-admin" onclick="dvNewSectionInline('${escJsAttr(base)}')">＋ New ${escapeHtml(itemLabel)}</button>
  </div>`;

  if (sectionsArr.length === 0) {
    ch += `<div style="padding:40px 20px;text-align:center;color:var(--mid)">
      <div style="font-size:36px;margin-bottom:8px;opacity:0.5">🗂</div>
      <div>No ${baseLabel.toLowerCase()} yet — click <strong>＋ New ${escapeHtml(itemLabel)}</strong> above to add one.</div>
    </div>`;
  }

  for (const sec of sectionsArr) {
    ch += `<div class="dv-section" id="dv-sec-${escAttr(base)}-${escAttr(sec.num)}">
      <div class="dv-section-header">
        <span class="dv-section-num">${escapeHtml(itemLabel.toUpperCase())} ${escapeHtml(sec.num)}</span>
        <span class="dv-section-title">${escapeHtml(sec.title)}</span>
        <button class="dv-entry-edit-btn" onclick="dvEditSectionInline('${escJsAttr(sec.num)}','${escJsAttr(base)}')">⚙ Edit</button>
      </div>
      <div class="dv-section-body">
        <div class="dv-section-desc">${sec.description || '<em style="color:var(--mid)">(no description)</em>'}</div>`;
    const entries = entriesTreeOrder(sec.num, base);
    for (const e of entries) {
      const ind = entryDepthBelowSection(e.id) * 22;
      ch += `<div class="dv-entry" id="dv-en-${escAttr(base)}-${escAttr(e.id)}" data-entry-id="${escAttr(e.id)}" data-base="${escAttr(base)}" style="margin-left:${ind}px${ind?';border-left:2px solid var(--border);padding-left:14px':''}">
        <div class="dv-entry-head">
          <span class="dv-entry-num">${escapeHtml(e.id)}</span>
          <span class="dv-entry-title">${escapeHtml(e.title)}</span>
          <div class="dv-entry-actions">
            <button class="dv-entry-edit-btn" onclick="dvNewSubInline('${escJsAttr(e.id)}','${escJsAttr(base)}')" title="Add a sub-entry under this">＋ Sub</button>
            <button class="dv-entry-edit-btn" onclick="dvEditEntryInline('${escJsAttr(e.id)}','${escJsAttr(base)}')">✎ Edit</button>
          </div>
        </div>
        <div class="dv-entry-content" id="dv-content-${escAttr(base)}-${escAttr(e.id)}">${e.content}</div>
      </div>`;
    }
    ch += `<button class="dv-add-entry-btn" onclick="dvNewEntryInline('${escJsAttr(sec.num)}','${escJsAttr(base)}')">＋ Add Entry to ${escapeHtml(itemLabel)} ${escapeHtml(sec.num)}</button>`;
    ch += `</div></div>`;
  }

  content.innerHTML = ch;
  content.querySelectorAll('.dv-entry-content img').forEach(i => i.classList.add('entry-img'));
}

/* ── Documentation-view INLINE editing & creation ──
   In doc view the editor never uses the modal: editing and creating
   entries/sections happen inline, in the content column, so the full-width
   Tiptap editor is usable. (The sidebar and other views still use the modal.)
   Saves/deletes reuse the same data helpers and globals as the modal. ── */

// Shared entry form (ID / Title / Keywords / Tiptap content + buttons).
function dvEntryFormHTML(edId, tbId, titleVal, kwVal, saveOnclick, deleteBtn) {
  return `<div class="dv-inline-form">
    <label class="form-label">Title</label>
    <input class="form-input" id="${edId}__title" value="${escAttr(titleVal)}">
    <label class="form-label">Keywords</label>
    <input class="form-input" id="${edId}__kw" value="${escAttr(kwVal)}" placeholder="comma, separated — used by the search engine">
    <label class="form-label">Content</label>
    <div class="rt-wrap"><div class="rt-toolbar" id="${tbId}"></div><div class="rt-editor" id="${edId}" data-placeholder="Write the entry content…"></div></div>
    <div class="dv-edit-controls">
      <button class="btn btn-primary" onclick="${saveOnclick}">Save</button>
      <button class="btn btn-secondary" onclick="renderDocView()">Cancel</button>
      ${deleteBtn || ''}
    </div>
  </div>`;
}

// Validate + persist an entry from an inline form. IDs are auto-assigned —
// editing keeps the existing id; a new sub-entry uses suggestChildId(parent);
// a new top-level entry gets the next free "<section>.<n>".
function _dvCommitEntry(base, edId, origId, ctxSection, ctxParent) {
  base = base || 'handbook';
  const title = document.getElementById(edId + '__title').value.trim();
  const kwRaw = document.getElementById(edId + '__kw').value.trim();
  const content = getEditorHTML(edId);
  if (!title) { alert('Title is required.'); return; }
  if (!stripHtml(content)) { alert('Entry content cannot be empty.'); return; }
  let id;
  if (origId) id = origId;
  else if (ctxParent) id = suggestChildId(ctxParent, base);
  else {
    const existing = entriesInSection(ctxSection, base).map(e => e.id);
    let n = 1; while (existing.includes(`${ctxSection}.${n}`)) n++;
    id = `${ctxSection}.${n}`;
  }
  const sec = findSection(sectionNumOf(id), base);
  if (!sec) { alert('Could not resolve the section for this entry.'); return; }
  const store = entriesOf(base);
  const keywords = kwRaw.split(',').map(k => k.trim()).filter(Boolean);
  const sectionLabel = `${sec.num}. ${sec.title}`;
  let savedEntry;
  if (origId) {
    const idx = store.findIndex(e => e.id === origId);
    if (idx === -1) { alert('Entry not found.'); return; }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store[idx] = savedEntry;
  } else {
    if (store.some(e => e.id === id)) { alert(`An entry with ID "${id}" already exists.`); return; }
    savedEntry = { id, section: sectionLabel, title, keywords, content };
    store.push(savedEntry);
  }
  saveAll('Entry saved');
  attachEmbedding(savedEntry, base);
  renderSidebar();
  renderDocView();
}

function dvEditEntryInline(id, base) {
  base = base || 'handbook';
  const entry = findEntry(id, base); if (!entry) return;
  const sectionNum = sectionNumOf(id);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to edit handbook entries.');
    return;
  }
  const card = document.getElementById(`dv-en-${base}-${id}`); if (!card) return;
  const edId = `dvE-ed-${base}-${id}`, tbId = `dvE-tb-${base}-${id}`;
  const del = `<button class="dv-del-btn" type="button" title="Delete entry" onclick="dvDeleteEntryInline('${escJsAttr(id)}','${escJsAttr(base)}')">🗑</button>`;
  card.innerHTML = dvEntryFormHTML(edId, tbId, entry.title, (entry.keywords || []).join(', '),
    `_dvCommitEntry('${escJsAttr(base)}','${escJsAttr(edId)}','${escJsAttr(id)}','','')`, del);
  initEditor(edId, tbId, entry.content);
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function dvDeleteEntryInline(id, base) {
  editEntryId = id; editEntryBase = base || 'handbook'; editEntrySrcSection = sectionNumOf(id);
  deleteCurrentEntry();   // reuses the modal's delete logic (handles descendants)
}

function dvNewEntryInline(sectionNum, base) {
  base = base || 'handbook';
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need Admin Mode to add entries.');
    return;
  }
  const secEl = document.getElementById(`dv-sec-${base}-${sectionNum}`);
  const body = secEl ? secEl.querySelector('.dv-section-body') : null;
  if (!body) return;
  const edId = `dvNE-ed-${base}-${sectionNum}`, tbId = `dvNE-tb-${base}-${sectionNum}`;
  if (document.getElementById(`${edId}__wrap`)) { document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior:'smooth' }); return; }
  const html = `<div class="dv-inline-new" id="${edId}__wrap"><div class="dv-inline-new-title">New entry — ID assigned automatically</div>` +
    dvEntryFormHTML(edId, tbId, '', '', `_dvCommitEntry('${escJsAttr(base)}','${escJsAttr(edId)}','','${escJsAttr(sectionNum)}','')`, '') + `</div>`;
  const addBtn = body.querySelector('.dv-add-entry-btn');
  if (addBtn) addBtn.insertAdjacentHTML('beforebegin', html); else body.insertAdjacentHTML('beforeend', html);
  initEditor(edId, tbId, '');
  document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function dvNewSubInline(parentId, base) {
  base = base || 'handbook';
  const sectionNum = sectionNumOf(parentId);
  if (!canEditSection(base, sectionNum)) {
    if (base === 'projects') promptUnlockProjectSection(sectionNum);
    else alert('You need edit access to add sub-entries.');
    return;
  }
  const card = document.getElementById(`dv-en-${base}-${parentId}`); if (!card) return;
  const edId = `dvNS-ed-${base}-${parentId}`, tbId = `dvNS-tb-${base}-${parentId}`;
  if (document.getElementById(`${edId}__wrap`)) { document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior:'smooth' }); return; }
  const html = `<div class="dv-inline-new" id="${edId}__wrap"><div class="dv-inline-new-title">New sub-entry under ${escapeHtml(parentId)} — ID assigned automatically</div>` +
    dvEntryFormHTML(edId, tbId, '', '', `_dvCommitEntry('${escJsAttr(base)}','${escJsAttr(edId)}','','','${escJsAttr(parentId)}')`, '') + `</div>`;
  card.insertAdjacentHTML('afterend', html);
  initEditor(edId, tbId, '');
  document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ── Section inline edit / create ── */
function dvSectionFormHTML(itemLabel, edId, tbId, titleVal, passkeyHtml, saveOnclick, deleteBtn) {
  return `<div class="dv-inline-form">
    <label class="form-label">${escapeHtml(itemLabel)} Title</label>
    <input class="form-input" id="${edId}__title" value="${escAttr(titleVal)}">
    <label class="form-label">Description</label>
    <div class="rt-wrap"><div class="rt-toolbar" id="${tbId}"></div><div class="rt-editor" id="${edId}" data-placeholder="Brief description shown on the section page…"></div></div>
    ${passkeyHtml || ''}
    <div class="dv-edit-controls">
      <button class="btn btn-primary" onclick="${saveOnclick}">Save</button>
      <button class="btn btn-secondary" onclick="renderDocView()">Cancel</button>
      ${deleteBtn || ''}
    </div>
  </div>`;
}
function _dvPasskeyHtml(edId, val) {
  return `<label class="form-label">Edit Passkey <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--mid)">(share with users who can edit this project)</span></label>
    <div style="display:flex;gap:6px">
      <input class="form-input" id="${edId}__pk" readonly value="${escAttr(val)}" style="flex:1;font-family:'Consolas','Courier New',monospace;letter-spacing:0.08em">
      <button class="btn btn-secondary" type="button" onclick="dvCopyPasskey('${escJsAttr(edId)}')">Copy</button>
      <button class="btn btn-secondary" type="button" onclick="dvRegenPasskey('${escJsAttr(edId)}')">↻ New</button>
    </div>`;
}
function dvCopyPasskey(edId) { const i = document.getElementById(edId + '__pk'); if (i && i.value) navigator.clipboard.writeText(i.value).then(() => showToast('Passkey copied')); }
async function dvRegenPasskey(edId) {
  if (!await customConfirm('Generate a new passkey? The old one will stop working for anyone using it.', { danger: true, confirmLabel: 'Rotate passkey' })) return;
  const i = document.getElementById(edId + '__pk');
  if (i) i.value = generatePasskey();
}

function dvEditSectionInline(num, base) {
  base = base || 'handbook';
  const sec = findSection(num, base); if (!sec) return;
  if (!isAdminMode && !(base === 'projects' && unlockedProjects.has(String(num)))) {
    if (base === 'projects') promptUnlockProjectSection(num);
    else alert('Admin Mode required to edit section info.');
    return;
  }
  const secEl = document.getElementById(`dv-sec-${base}-${num}`); if (!secEl) return;
  const header = secEl.querySelector('.dv-section-header'); if (!header) return;
  const descEl = secEl.querySelector('.dv-section-desc'); if (descEl) descEl.style.display = 'none';
  const itemLabel = base === 'projects' ? 'Project' : 'Section';
  const edId = `dvS-ed-${base}-${num}`, tbId = `dvS-tb-${base}-${num}`;
  let pk = '';
  if ((base === 'projects') && isAdminMode) { if (!sec.passkey) sec.passkey = generatePasskey(); pk = _dvPasskeyHtml(edId, sec.passkey); }
  const del = isAdminMode ? `<button class="dv-del-btn" type="button" title="Delete ${escapeHtml(itemLabel)}" onclick="dvDeleteSectionInline('${escJsAttr(num)}','${escJsAttr(base)}')">🗑</button>` : '';
  const form = `<div class="dv-inline-new"><div class="dv-inline-new-title">Edit ${escapeHtml(itemLabel)} ${escapeHtml(num)}</div>` +
    dvSectionFormHTML(itemLabel, edId, tbId, sec.title, pk, `dvSaveSectionInline('${escJsAttr(num)}','${escJsAttr(base)}')`, del) + `</div>`;
  header.outerHTML = form;
  initEditor(edId, tbId, sec.description || '');
}

function dvSaveSectionInline(origNum, base) {
  base = base || 'handbook';
  const edId = `dvS-ed-${base}-${origNum}`;
  const title = document.getElementById(edId + '__title').value.trim();
  const desc = getEditorHTML(edId);
  const pkInp = document.getElementById(edId + '__pk');
  const passkey = pkInp ? pkInp.value.trim() : '';
  if (!title) { alert('Title is required.'); return; }
  const sec = findSection(origNum, base); if (!sec) return;
  // Number is auto-managed and immutable; only title/description/passkey change.
  sec.title = title; sec.description = desc;
  if (base === 'projects' && passkey) sec.passkey = passkey;
  entriesOf(base).forEach(e => { if (sectionNumOf(e.id) === origNum) e.section = `${origNum}. ${title}`; });
  saveAll('Saved');
  renderSidebar();
  renderDocView();
}

function dvDeleteSectionInline(num, base) {
  editSectionNum = num; editSectionBase = base || 'handbook';
  deleteCurrentSection();   // reuses the modal's delete logic (admin-only)
}

function dvNewSectionInline(base) {
  base = base || 'handbook';
  const content = document.getElementById('docview-content'); if (!content) return;
  const itemLabel = base === 'projects' ? 'Project' : 'Section';
  const edId = `dvNSEC-ed-${base}`, tbId = `dvNSEC-tb-${base}`;
  if (document.getElementById(`${edId}__wrap`)) { document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior:'smooth' }); return; }
  const nums = sectionsOf(base).map(s => parseInt(s.num)).filter(n => !isNaN(n));
  const nextNum = nums.length ? Math.max(...nums) + 1 : 1;
  const pk = (base === 'projects' && isAdminMode) ? _dvPasskeyHtml(edId, generatePasskey()) : '';
  const html = `<div class="dv-inline-new" id="${edId}__wrap"><div class="dv-inline-new-title">New ${escapeHtml(itemLabel)} — number ${nextNum} assigned automatically</div>` +
    dvSectionFormHTML(itemLabel, edId, tbId, '', pk, `dvSaveNewSectionInline('${escJsAttr(base)}')`, '') + `</div>`;
  const titleBar = content.querySelector('.dv-title-bar');
  if (titleBar) titleBar.insertAdjacentHTML('afterend', html); else content.insertAdjacentHTML('afterbegin', html);
  initEditor(edId, tbId, '');
  document.getElementById(`${edId}__wrap`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function dvSaveNewSectionInline(base) {
  base = base || 'handbook';
  const edId = `dvNSEC-ed-${base}`;
  const title = document.getElementById(edId + '__title').value.trim();
  const desc = getEditorHTML(edId);
  const pkInp = document.getElementById(edId + '__pk');
  const passkey = pkInp ? pkInp.value.trim() : '';
  if (!title) { alert('Title is required.'); return; }
  // Section number is auto-assigned (next available), never typed.
  const nums = sectionsOf(base).map(s => parseInt(s.num)).filter(n => !isNaN(n));
  const num = String(nums.length ? Math.max(...nums) + 1 : 1);
  const newSec = { num, title, description: desc };
  if (base === 'projects') newSec.passkey = passkey || generatePasskey();
  sectionsOf(base).push(newSec);
  saveAll('Saved');
  renderSidebar();
  renderDocView();
}

/* ══════════════════════════════════════════
   UNDER MAINTENANCE overlay
   Shown whenever the dashboard isn't connected to Firebase (server down,
   no internet, or unconfigured). An admin can skip it for the session.
   ══════════════════════════════════════════ */
let _maintBypassed = false;   // resets on refresh — bypass lasts only this session
function showMaintenance(state) {
  if (_maintBypassed) return;
  const o = document.getElementById('maint-overlay');
  const sub = document.getElementById('maint-sub');
  if (sub) sub.textContent = (state === 'connecting')
    ? 'Connecting to the dashboard…'
    : 'Still trying to reach the server…';
  if (o) o.classList.add('open');
}
function hideMaintenance() {
  const o = document.getElementById('maint-overlay');
  if (o) o.classList.remove('open');
}
function maintShowPwd() {
  const w = document.getElementById('maint-pwd-wrap');
  w.classList.add('open');
  const i = document.getElementById('maint-pwd');
  i.value = ''; i.classList.remove('error');
  document.getElementById('maint-pwd-err').textContent = '';
  setTimeout(() => i.focus(), 50);
}
function maintTryPwd() {
  const i = document.getElementById('maint-pwd');
  if (i.value === ADMIN_PW) {
    _maintBypassed = true;
    hideMaintenance();
    showToast('Maintenance screen bypassed for this session');
  } else {
    i.classList.add('error');
    document.getElementById('maint-pwd-err').textContent = 'Incorrect password.';
    i.value = '';
    setTimeout(() => i.classList.remove('error'), 400);
  }
}

/* ══════════════════════════════════════════
   LOGIN overlay
   First gate before the dashboard loads. Closed by either a valid team-member
   passkey (which identifies the user → owns their profile in TEAM_DIRECTORY)
   or the admin password (no specific identity, just turns Admin Mode on).
   ══════════════════════════════════════════ */
function showLogin() {
  // Sync the dashboard/studio name to whatever SITE_SETTINGS currently has so
  // the login screen reflects renames the admin made.
  const nameEl   = document.getElementById('login-site-name');
  const studioEl = document.getElementById('login-studio-name');
  if (nameEl)   nameEl.textContent   = (SITE_SETTINGS && SITE_SETTINGS.siteName)   || 'VL Dashboard';
  if (studioEl) studioEl.textContent = (SITE_SETTINGS && SITE_SETTINGS.studioName) || 'Mega Cat Studios';
  const inp = document.getElementById('login-pwd');
  if (inp) { inp.value = ''; inp.classList.remove('error'); }
  const err = document.getElementById('login-err');
  if (err) err.textContent = '';
  document.getElementById('login-overlay').classList.add('open');
  setTimeout(() => { if (inp) inp.focus(); }, 80);
}

function hideLogin() {
  const o = document.getElementById('login-overlay');
  if (!o) return;
  o.classList.add('fading-out');
  // Match the CSS animation duration (0.45s).
  setTimeout(() => { o.classList.remove('open'); o.classList.remove('fading-out'); }, 460);
}

async function loginTry() {
  const inp = document.getElementById('login-pwd');
  const err = document.getElementById('login-err');
  const submitBtn = document.getElementById('login-submit');
  const remember = !!document.getElementById('login-remember').checked;
  const raw = (inp.value || '').trim();
  if (!raw) {
    err.textContent = 'Enter your passkey.';
    return;
  }

  // 1) Admin password — bypass without attaching a specific user identity.
  //    No Firebase dependency, no team-directory lookup; just unlock & flag.
  if (raw === ADMIN_PW) {
    currentUser = null;
    currentUserPersistent = false;
    try { localStorage.removeItem(LOGIN_KEY); } catch(e){}
    try { sessionStorage.removeItem(LOGIN_KEY); } catch(e){}
    isAdminMode = true;
    document.body.classList.add('admin-mode');
    _swapAdminIcons(true);
    _bootProceedAfterLogin({ slackName: 'Admin', isAdmin: true });
    return;
  }

  // 2) Team-member passkey — first try local cache (fast path).
  let member = _findMemberByPasskey(raw);

  // 2a) If the local cache misses but Firebase is still loading, wait for
  //     it before declaring the passkey invalid. This is what makes cross-
  //     browser logins work: a profile created in Opera lives on Firebase,
  //     not yet in this Chrome's localStorage — so we MUST give the remote
  //     pull a chance to complete before saying "incorrect passkey."
  if (!member && _fbInitResult === null) {
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Syncing with team…';
    err.textContent = '';
    try { await _fbInitPromise; } catch(e) {}
    submitBtn.disabled = false;
    submitBtn.textContent = origText;
    member = _findMemberByPasskey(raw);
  }

  if (member) {
    setCurrentUser(member, remember);
    _bootProceedAfterLogin({ slackName: member.slackName || member.realName || '', isAdmin: false });
    return;
  }

  // 3) Failed — distinguish "couldn't reach server" from "wrong code" so the
  //    user knows whether to retry the code or check their connection.
  inp.classList.add('error');
  if (_fbInitResult === false) {
    err.textContent = "Couldn't reach the team server. Check your connection, or use the admin password.";
  } else {
    err.textContent = 'Incorrect passkey. Try again, or use the admin password.';
  }
  inp.value = '';
  setTimeout(() => inp.classList.remove('error'), 400);
  inp.focus();
}

// Plays the welcome fade, then dismisses the login overlay and lets the rest
// of the boot sequence (maintenance overlay + Firebase init) take over.
function _bootProceedAfterLogin(info) {
  playWelcome(info, () => {
    hideLogin();
    _runMainBootstrap();      // Firebase + initial render — see INIT block
    _renderSignOutChip();     // expose the sign-out chip if a user is logged in
  });
}

function playWelcome(info, done) {
  const overlay = document.getElementById('welcome-overlay');
  const msg = document.getElementById('welcome-msg');
  const sub = document.getElementById('welcome-sub');
  if (!overlay || !msg) { done && done(); return; }
  if (info && info.isAdmin) {
    msg.textContent = 'Welcome, Admin!';
    sub.textContent = 'Admin Mode enabled for this session.';
  } else {
    const name = (info && info.slackName) ? '@' + String(info.slackName).replace(/^@/, '') : 'friend';
    msg.textContent = 'Welcome, ' + name + '!';
    sub.textContent = '';
  }
  overlay.classList.add('open');
  // The CSS animation runs ~1.7s. Hand off to the next step shortly before it
  // finishes so the maintenance overlay is already visible underneath the
  // tail end of the fade-out (smoother feel than waiting for full transparency).
  setTimeout(() => {
    overlay.classList.remove('open');
    done && done();
  }, 1450);
}

function _renderSignOutChip() {
  const chip = document.getElementById('signout-chip');
  if (!chip) return;
  if (currentUser && currentUser.slackName) {
    chip.innerHTML = '<span>Logged in as</span><span class="so-name">@' +
      escapeHtml(String(currentUser.slackName).replace(/^@/, '')) +
      '</span><span>· Sign out</span>';
    chip.classList.add('visible');
  } else {
    chip.classList.remove('visible');
  }
}

/* ══════════════════════════════════════════
   KEYBOARD
   ══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  // Lightbox first
  if (document.getElementById('lightbox-overlay').classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === '+' || e.key === '=') zoomLightbox(0.25);
    else if (e.key === '-' || e.key === '_') zoomLightbox(-0.25);
    else if (e.key === '0') resetLightboxZoom();
    return;
  }

  if (e.key === 'Escape') {
    for (const id of ['new-pk-overlay','pk-modal-overlay','kpi-overlay','tm-detail-overlay','team-modal-overlay','syn-modal-overlay','settings-modal-overlay','entry-modal-overlay','section-modal-overlay','si-modal-overlay','ann-modal-overlay','pwd-modal-overlay','cat-modal-overlay']) {
      const m = document.getElementById(id);
      if (m && m.classList.contains('open')) { m.classList.remove('open'); return; }
    }
    if (document.getElementById('search-modal-overlay').classList.contains('open')) { closeSearchModal(); return; }
  }
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    e.preventDefault();
    openSearchModal();
  }
});

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

// Decide login vs resume. sessionStorage-scoped session: same tab refresh
// keeps the session; closing the browser ends it (per "Stay signed in for
// this session").
const _restored = loadCurrentUser();
if (_restored) {
  _renderSignOutChip();
  // No login overlay, no welcome fade — straight to the dashboard. Firebase
  // is loading in the background; the status dot reflects connection state.
} else {
  showLogin();
}

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
