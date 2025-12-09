import React from 'react';
import { Badge } from '../../components/ui/badge.jsx';
import { FaStar, FaHandshake, FaUserGroup, FaTrophy, FaChartLine, FaCode, FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa6";
import { LuSwords } from "react-icons/lu";
import { Button } from '../../components/ui/button.jsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Activity, BookOpen, CheckCircle2, Code2, Linkedin, Swords, Terminal, Trophy, Zap } from 'lucide-react';


const AboutUs = () => {
  const iconBaseClass = "w-10 h-10 rounded-full border border-neutral-700 text-neutral-400 flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 hover:text-neutral-900 hover:border-yellow-500";
  const featuresList = [
    {
      title: "Real-Time 1v1 Duels",
      description: "Battle opponents live in synchronized code editors. Feel the pressure as every keystroke counts.",
      icon: LuSwords,
    },
    {
      title: "ELO-Based Matchmaking",
      description: "Fair competition guaranteed. Our system automatically finds opponents matching your current skill level.",
      icon: FaHandshake,
    },
    {
      title: "Friends System",
      description: "Build your network. Track online status, send direct challenges, and nurture friendly rivalries.",
      icon: FaUserGroup,
    },
    {
      title: "Global Leaderboards",
      description: "Climb the ranks. Compete for top spots on weekly and monthly global standings.",
      icon: FaTrophy,
    },
    {
      title: "Performance Graph",
      description: "Visualize your growth. Track your ELO trends and match history over time with detailed analytics.",
      icon: FaChartLine,
    },
    {
      title: "Curated Problem Set",
      description: "Access a diverse library of DSA problems across all difficulty levels, hand-picked for duels.",
      icon: FaCode,
    },
  ];

  const stats = [
    {
      id: '001',
      value: '50K+',
      label: 'Lines of Code Run',
      icon: <Terminal size={18} />,
    },
    {
      id: '002',
      value: '<100ms',
      label: 'Execution Latency',
      icon: <Zap size={18} />,
    },
    {
      id: '003',
      value: '24/7',
      label: 'Live Matchmaking',
      icon: <Activity size={18} />,
    }
  ];
  const features = [
    "Real-time 1v1 Battles",
    "Instant Code Execution",
    "Global Elo Leaderboards",
    "Interview-Ready Problem Sets",
    "Community Tournaments",
    "Detailed Performance Analytics"
  ];

  const teamData = [
    {
      id: 1,
      image: "/team/akshatraval.png",
      name: "Akshat Raval",
      designation: "Founder of Codamigos",
      linkedIn: "https://linkedin.com/in/akshatraval2486",
      instageam: "https://www.instagram.com/__http.akshat/",
      github: "https://github.com/AkshatRaval",
      email: "akshatraval199@gmail.com"
    }
  ]


  return (
    <div className='relative w-full min-h-screen bg-background overflow-hidden'>

      {/* Cool Background Effects (Grid + Spotlight) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <section className='flex flex-col w-full items-center justify-start pt-24 space-y-6 px-4'>

        {/* Badge */}
        <div className='w-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <Badge variant="outline" className="text-sm md:text-md px-4 py-1.5 flex gap-2 border-primary/20 bg-secondary/30 backdrop-blur-md text-foreground/80 rounded-full shadow-sm hover:bg-secondary/50 transition-colors">
            <FaStar className="text-yellow-500" />
            <span>About Us</span>
          </Badge>
        </div>

        {/* Headline */}
        <div className='text-center max-w-5xl w-full mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100'>
          <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent'>
            Discover Our Mission to <br className="hidden md:block" />
            <span className="text-primary">Gamify</span> the Experience.
          </h1>
        </div>

        {/* Subtitle */}
        <div className='mt-5 text-lg md:text-xl font-light text-muted-foreground text-center max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200'>
          <p>We empower developers with seamless, real-time coding duels on a robust, performance-driven platform.</p>
        </div>

        {/* Button with Animation */}
        <div className='mt-8 flex animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300'>
          <Button
            variant="outline"
            className="group relative cursor-pointer text-base flex items-center gap-3 px-8 py-6 rounded-full border-foreground/10 bg-background/50 hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Explore More
            <svg
              className="w-6 h-6 p-1 rounded-full border border-foreground/30 text-foreground rotate-45 transition-all duration-300 ease-linear 
              group-hover:rotate-90 group-hover:bg-background group-hover:text-foreground group-hover:border-transparent"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-current"
              />
            </svg>
          </Button>
        </div>

        {/* Carousel Section */}
        <div className='max-w-7xl w-full mt-24 px-8 md:px-0 animate-in fade-in zoom-in-95 duration-1000 delay-500'>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6"> {/* Added negative margin to counter padding */}
              {featuresList.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-6 h-full">
                    <div className="p-1 h-full">
                      {/* Added h-full to Card so all cards match height */}
                      <Card className="bg-card/40 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_-15px_rgba(var(--primary-rgb),0.5)] group h-full overflow-hidden relative">

                        {/* Subtle background gradient splash on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                        <CardContent className="flex flex-col items-start justify-between p-8 h-full min-h-[280px] gap-6">

                          {/* Top Section: Icon and Number */}
                          <div className="flex justify-between items-start w-full">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                              <IconComponent className="w-8 h-8" />
                            </div>
                            {/* Subtle Index Number */}
                            <span className="text-5xl font-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity select-none absolute right-4 top-2">
                              0{index + 1}
                            </span>
                          </div>

                          {/* Bottom Section: Text Content */}
                          <div className="space-y-3 z-10">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-background/50 border-white/10 hover:bg-primary hover:text-white" />
            <CarouselNext className="hidden md:flex bg-background/50 border-white/10 hover:bg-primary hover:text-white" />
          </Carousel>
        </div>
      </section>
      <section className='min-h-screen w-full max-w-7xl flex-col flex justify-center m-2 mx-auto mt-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 w-full h-fit gap-2'>
          <div className='min-w-full h-full flex flex-col justify-center items-start space-y-8 p-4 lg:p-0'>

            <div className="space-y-4">
              <h1 className='text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1]'>
                The Ultimate Arena for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdd00] to-amber-700">
                  Developers
                </span>
              </h1>

              <p className='text-lg font-light text-zinc-400 max-w-md leading-relaxed'>
                We don't believe in paywalls for practice. Instead, we provide a fair, open-source battleground where skill is the only currency that matters.
              </p>
            </div>

            <Button className="h-14 px-8 text-lg font-mono font-bold rounded-sm border-2 border-[#ffdd00] bg-[#ffdd00] text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all hover:bg-[#ffdd00] cursor-pointer">
              <LuSwords className="mr-2 h-5 w-5" />
              START A DUEL
            </Button>

          </div>


          <div className='relative min-w-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-[#ffdd0020] via-[#1c1c1c] to-black shadow-2xl transition-all duration-300 hover:border-[#ffdd00]/40 group'>

            {/* Content Section */}
            <div className='relative z-10 p-8 flex flex-col items-center space-y-4'>
              <h1 className='text-4xl font-extrabold tracking-tight text-white drop-shadow-md'>
                Lightning Fast Execution
              </h1>
              <p className='text-zinc-400 text-lg max-w-lg leading-relaxed font-light'>
                Powered by Judge0. Run C++, Python, or JS code with <span className="text-[#ffdd00] font-medium">less than 100ms latency</span>. No lag, just logic.
              </p>
            </div>

            {/* Image Section with Glow Effect */}
            <div className='relative mt-3 flex justify-center w-full px-6 pb-0'>

              {/* Yellow Glow behind the image */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#ffdd00] blur-[80px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500"></div>

              <div className='relative z-10 transform transition-transform duration-500 hover:-translate-y-2'>
                <img
                  src="images/screenShotAbout.png"
                  className='rounded-t-2xl border-t border-l border-r border-white/20 shadow-2xl w-full max-w-2xl'
                  alt="Platform Screenshot"
                />
                {/* Fade overlay at the bottom to blend image into the card edge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>
          {/* 3rd */}
          <div className='min-w-full'>
            <div className="w-full max-w-sm bg-background rounded-3xl shadow-2xl overflow-hidden border font-sans relative text-slate-100">

              {/* Background decoration: Changed bg-blue-900 to bg-yellow-600 with lower opacity for a golden glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

              <div className="p-8 relative z-10">
                {/* Header */}
                <div className="mb-10">
                  <h3 className="text-2xl font-bold leading-tight">
                    We are turning <br />
                    {/* Changed text-blue-400 to text-yellow-400 */}
                    <span className="text-yellow-400">logic into a sport.</span>
                  </h3>
                  <p className="mt-3 text-sm text-slate-400">
                    The era of lonely tutorials is over. We built the arena where developers prove their skills.
                  </p>
                </div>

                {/* The Evolution Timeline */}
                <div className="relative space-y-8">
                  {/* The vertical line continuous background */}
                  <div className="absolute left-4 top-1 bottom-1 w-0.5 bg-slate-800"></div>

                  {/* Step 1: The Past (Faded) - No color changes needed here, kept Slate */}
                  <div className="relative flex items-start">
                    <div className="relative z-10 w-8 h-8 rounded-full flex shrink-0 items-center justify-center bg-slate-800 text-slate-500 border-4 border-slate-900">
                      <BookOpen size={14} />
                    </div>
                    <div className="ml-4 pt-0.5">
                      <h4 className="text-sm font-semibold text-slate-400">The Old Way</h4>
                      <p className="text-xs text-slate-500 mt-1">Reading docs alone in a dark room.</p>
                    </div>
                  </div>

                  {/* Step 2: The Bridge (Faded) - Kept Slate */}
                  <div className="relative flex items-start">
                    <div className="relative z-10 w-8 h-8 rounded-full flex shrink-0 items-center justify-center bg-slate-800 text-slate-500 border-4 border-slate-900">
                      <Code2 size={14} />
                    </div>
                    <div className="ml-4 pt-0.5">
                      <h4 className="text-sm font-semibold text-slate-400">The Grind</h4>
                      <p className="text-xs text-slate-500 mt-1">Solving LeetCode problems with no stakes.</p>
                    </div>
                  </div>

                  {/* Step 3: The Present (Highlighted - YELLOW THEME) */}
                  <div className="relative flex items-start">
                    {/* Active Icon: bg-yellow-500, text-yellow-950 for contrast */}
                    <div className="relative z-10 w-8 h-8 rounded-full flex shrink-0 items-center justify-center bg-yellow-500 text-yellow-950 border-4 border-slate-900 shadow-lg shadow-yellow-900/50">
                      <Swords size={14} />
                    </div>
                    {/* Active Text Box: Yellow tinted background and border */}
                    <div className="ml-4 -mt-1 bg-yellow-900/20 p-3 rounded-xl border border-yellow-700/30">
                      <h4 className="text-sm font-bold text-yellow-400">The Codamigos Era</h4>
                      <p className="text-xs text-yellow-100/60 mt-1">
                        Real-time 1v1 battles with live execution.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Stats Strip */}
              <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-t border-slate-800">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vision</span>
                  <span className="text-xs font-semibold text-slate-300">Gamifying Dev</span>
                </div>

                {/* UPDATED: Transparent Yellow Theme Trophy */}
                <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400 shadow-sm border border-yellow-500/20">
                  <Trophy size={16} />
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className='mt-10'>
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {stats.map((stat) => (
              <div key={stat.id} className="relative bg-background border rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-lg group hover:border-yellow-500/30 transition-colors duration-300">

                {/* Top Row: Value & Icon */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-4xl font-bold text-slate-100 tracking-tight">
                    {stat.value}
                  </h3>

                  {/* Icon Circle */}
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500/20 group-hover:text-yellow-300 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>

                {/* Bottom Row: Label & Watermark */}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                      {stat.label}
                    </p>
                  </div>
                  <span className="text-4xl font-bold text-slate-800/50 absolute -bottom-2 right-4 select-none pointer-events-none">
                    {stat.id}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='h-fit bg-linear-to-b to-accent/10 py-10 flex items-center justify-center font-sans'>

        <div className='bg-neutral-900 border border-yellow-600/20 max-w-7xl p-10 lg:p-16 rounded-[3rem] w-full mx-4 shadow-2xl shadow-yellow-900/10 relative overflow-hidden'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* LEFT COLUMN: Text Content */}
            <div className="space-y-8">

              <div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Let's know about our <br />
                  {/* Gold Highlight */}
                  <span className="text-yellow-400 drop-shadow-sm">main goal.</span>
                </h2>
                <p className="mt-6 text-lg text-neutral-400 font-medium leading-relaxed max-w-lg">
                  We aim to banish the isolation of learning to code. By combining real-time competition with instant execution, we transform standard algorithm practice into an adrenaline-fueled sport.
                </p>
              </div>

              {/* The Checkmark Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group cursor-default">

                    {/* Icon: Gold Theme */}
                    <div className="w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center shrink-0 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-300">
                      <CheckCircle2 size={14} className="text-yellow-500 group-hover:text-black" />
                    </div>

                    {/* Text: White -> Gold on hover */}
                    <span className="text-base font-semibold text-neutral-300 group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: Image */}
            <div className="relative flex justify-center lg:justify-end">

              {/* Gold Backdrop Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl"></div>

              {/* The Image */}
              <img
                src="https://cdn3d.iconscout.com/3d/premium/thumb/web-developer-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--coding-programming-css-html-development-pack-business-illustrations-4433367.png"
                alt="Codamigos Developer"
                className="relative w-full max-w-md drop-shadow-2xl grayscale-20% hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
      <section className='w-full max-w-7xl mx-auto py-15'>
        <div className='w-full text-center mb-16 space-y-2'>
          {/* Main Heading with Golden Highlight */}
          <h1 className='text-4xl md:text-5xl font-extrabold text-white tracking-tight'>
            Meet our <span className='text-yellow-500'>Expert Team</span>
          </h1>

          {/* Subtext in Muted Silver */}
          <p className='text-lg text-neutral-400 max-w-xl mx-auto font-normal'>
            We aim to share information about our team
          </p>
        </div>
        <div className='w-full py-10 px-4 flex justify-center'>
          {/* Grid container with better spacing */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl'>
            {teamData.map((member) => (
              // 1. Main Card Container: Relative positioning is key here. Added specific height.
              <div
                className="relative w-full max-w-[350px] h-[450px] mx-auto bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-800 group"
                key={member.id}
              >
                {/* 2. Image Container */}
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10 pointer-events-none"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[80%] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* 3. Floating Info Box Container: Absolutely positioned at the bottom */}
                <div className='absolute bottom-4 left-4 right-4 z-20'>
                  {/* The actual info card look with distinct background and blur */}
                  <div className="bg-neutral-800/95 backdrop-blur-sm p-6 rounded-3xl border border-neutral-700/50 text-center shadow-lg">
                    <h1 className="text-2xl font-bold text-yellow-500 mb-1 tracking-tight">
                      {member.name}
                    </h1>
                    <p className="text-sm text-neutral-400 mb-5 uppercase tracking-wider font-medium">
                      {member.designation}
                    </p>

                    {/* Social Icons - Consistent styling */}
                    <div className="flex justify-center gap-3">
                      <a href={member.linkedIn} className={iconBaseClass}>
                        <FaLinkedin />
                      </a>
                      <a href={member.instageam} className={iconBaseClass}>
                        <FaInstagram />
                      </a>
                      <a href={member.github} className={iconBaseClass}>
                        <FaGithub />
                      </a>
                      <a href={`mailto:${member.email}`} className={iconBaseClass}>
                        <FaEnvelope />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs