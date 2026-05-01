import { themeToCssVars } from "./Themes";

export const suggestions = [
  {
    icon: '💼',
    name: 'Job Board Marketplace',
    description: 'Resume search, job listings, and application tracker. Clean filters and profile cards for recruiters.'
  },
  {
    icon: '📚',
    name: 'AI Learning Platform',
    description: 'Gamified learning experience with progress steps and streaks. Friendly, engaging, and colorful UI.'
  },
   {
    icon: '🚀',
    name: 'AI Startup Landing',
    description: 'SaaS hero with animated particles, pricing tiers, and feature grids. Gradient modern design for AI product launches.'
  },
  {
    icon: '💳',
    name: 'Finance Tracker',
    description: 'Expense tracking dashboard with charts and budget goals. Minimal UI with dark mode support.'
  },
  {
    icon: '🛒',
    name: 'E-Commerce Store',
    description: 'Product browsing and checkout experience. Premium UI with strong call-to-action design.'
  },
  {
    icon: '🗓️',
    name: 'Smart To-Do Planner',
    description: 'Task management with calendar and priority views. Simple productivity-focused interface.'
  },
 {
    icon: '🏋️',
    name: 'Fitness Coach App',
    description: 'Personalized workout plans with progress tracking and video tutorials. Energetic, motivational UI.'
  }
]

export const htmlWrapper =(theme:any,htmlCode:string,isMobile:boolean)=>{
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
   <meta name="viewport" content="width=${isMobile ? '400' : '1200'}, initial-scale=1" />
  <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  
  <!-- Tailwind + Iconify -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

  <style >
    ${themeToCssVars(theme)}
  </style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] w-full">
  ${htmlCode ?? ""}
</body>
</html>
`};