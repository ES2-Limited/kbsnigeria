# KBS Nigeria Website Revamp

## Project Context
Revamp of kbsnigeria.com — Knowledgebased Basic Science Schools, FHA Lugbe, Abuja.
Private Nursery–JSS school. Current site is a dated WordPress build from 2017.
Goal: modern, fast, mobile-first website serving parents and prospective students.

## Skills
@~/.claude/skills/project-management
@~/.claude/skills/engineering
@~/.claude/skills/engineering-team
@~/.claude/skills/product-team
@~/.claude/skills/ui-design

## Active Roles
- Planning / backlog / sprints → Senior PM + Scrum Master
- Writing code → Senior Frontend Engineer
- UI work → Senior UI/UX Designer
- Code review → Tech Lead

# KBS Nigeria Website Revamp

## Project Docs
@./PRD.md
@./TRD.md
@./DESIGN.md

## Skills
@~/.claude/skills/project-management
@~/.claude/skills/engineering
@~/.claude/skills/engineering-team
@~/.claude/skills/product-team
@~/.claude/skills/ui-design

## Active Roles
- Planning / backlog / sprints → PM + Scrum Master (follow PRD phases)
- Writing code → Senior Frontend Engineer (follow TRD stack exactly)
- UI work → Senior UI/UX Designer (follow DESIGN.md tokens, colours, fonts)
- Code review → Tech Lead

## Hard Rules
- Stack: Vite + React 18 + Tailwind CSS v3 + Framer Motion + Supabase
- Always use KBS design tokens — never invent colours or fonts outside DESIGN.md
- Admin routes always wrapped in AdminRoute auth guard
- Resend API key lives in Supabase Edge Functions only — never in .env frontend
- All animations must respect useReducedMotion()