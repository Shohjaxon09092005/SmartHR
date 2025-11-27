# Quick Fix Guide - Converting Static Pages to Use API

## Pages Still Using Static Data

I'm currently updating these pages to use the real API:

### ✅ Already Updated
- ✅ **Register/Login** - Using API
- ✅ **JobMatches** - Using API  
- ✅ **CreateVacancy** - Using API
- ✅ **Applications** - Being updated now

### 🔄 In Progress
- 🔄 **Applications** - Converting now

### 📋 Still Need Update
- 📋 **VacanciesList** (Employer) - Using mock data
- 📋 **VacanciesPage** (Admin) - Using mock data  
- 📋 **UsersPage** (Admin) - Using mock data
- 📋 **AdminDashboard** - Using mock data
- 📋 **Applicants** (Employer) - May need update
- 📋 **EditVacancy** - May need update

## How I'm Fixing This

1. **Remove mock data** - Delete all mock constants
2. **Import API services** - Use the services we created
3. **Add useEffect** - Fetch data on component mount
4. **Update handlers** - Make them call API instead of local state
5. **Add loading states** - Show spinners while loading
6. **Handle errors** - Show toast messages on errors

## Testing After Updates

1. Make sure backend is running (`npm run dev` in server/)
2. Make sure database is migrated (`npm run db:migrate`)
3. Test each page:
   - Applications page should show your real applications
   - VacanciesList should show real vacancies for employer
   - UsersPage should show real users (admin only)

## Status

Working on it now! The Applications page is being converted, then I'll do VacanciesList and the others.

