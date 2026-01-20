// Import Packages
// import { useSelector } from 'react-redux';

// Import Icons
import DashboardIcon from '@mui/icons-material/GridViewOutlined';
import StaffIcon from '@mui/icons-material/PeopleAltOutlined';
import CoachMainIcon from '@mui/icons-material/Diversity1Outlined';
import ClientMainIcon from '@mui/icons-material/GroupsOutlined';
import ClientIcon from '@mui/icons-material/SpatialTrackingOutlined';
import SubscriptionHistoryIcon from '@mui/icons-material/ManageSearchOutlined';
import RequestIcon from '@mui/icons-material/QuizOutlined';
import ProfileIcon from '@mui/icons-material/AssignmentIndOutlined';
import AppointmentIcon from '@mui/icons-material/CalendarMonthOutlined';
import WorkingHoursIcon from '@mui/icons-material/AccessTimeOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import SubscriptionMainIcon from '@mui/icons-material/AutoModeOutlined';
import PaymentHistoryIcon from '@mui/icons-material/CurrencyExchange';
import CoachIcon from '@mui/icons-material/RecordVoiceOverOutlined';

// Import Files
// import { selectLoginId } from "../../src/app/stores/authSlice";

// const loginId = useSelector(selectLoginId);

export const navItems = {
  adminMenuItems: [
    { path: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize='small' /> },
    { path: "/admin/staff", label: "Staffs", icon: <StaffIcon fontSize='small' /> },
    { label: "Coach Management", 
      icon: <CoachMainIcon fontSize="small" />,
      children: [
        {path: "/admin/coach", label: "Coach", icon: <CoachIcon fontSize="small"/> },
        { path: "/admin/subscriptionHistory", label: "Subscription History", icon: <SubscriptionHistoryIcon fontSize='small' /> },
      ]
     },
    {
      label: "Client Management",
      icon: <ClientMainIcon fontSize="small" />,
      children: [
        { path: "/admin/client", label: "Clients", icon: <ClientIcon fontSize='small' /> },
        { path: "/admin/mapCoach", label: "Map Coach", icon: <RequestIcon fontSize='small' /> },
        { path: "/admin/paymentHistory", label: "Payment History", icon: <PaymentHistoryIcon fontSize='small' /> },
      ]
    },
    { path: "/admin/subscription", label: "Subscription", icon: <SubscriptionMainIcon fontSize="small" />},
  ],
  staffMenuItems: [
    { path: "/staff/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize='small' /> },
    { label: "Coach Management", 
      icon: <CoachMainIcon fontSize="small" />,
      children: [
        {path: "/staff/coach", label: "Coach", icon: <CoachIcon fontSize="small"/> },
        { path: "/staff/subscriptionHistory", label: "Subscription History", icon: <SubscriptionHistoryIcon fontSize='small' /> },
      ]
     },
    {
      label: "Client Management",
      icon: <ClientMainIcon fontSize="small" />,
      children: [
        { path: "/staff/client", label: "Clients", icon: <ClientIcon fontSize='small' /> },
        { path: "/staff/mapCoach", label: "Map Coach", icon: <RequestIcon fontSize='small' /> },
        { path: "/staff/paymentHistory", label: "Payment History", icon: <PaymentHistoryIcon fontSize='small' /> },
      ]
    },
    { path: "/staff/subscription", label: "Subscription", icon: <SubscriptionMainIcon fontSize="small" />},
  ],
  coachMenuItems: [
    { path: "/coach/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize='small' /> },
    { path: "/coach/details/fromProfile", label: "Profile", icon: <ProfileIcon fontSize='small' /> },
    { path: "/coach/subscriptionHistory", label: "Subscription History", icon: <SubscriptionHistoryIcon fontSize='small' /> },
    { path: "/coach/workingHours", label: "Working Hours", icon: <WorkingHoursIcon fontSize='small' /> },
    { path: "/coach/client", label: "Clients", icon: <ClientIcon fontSize='small' /> },
    { path: "/coach/appointmentHistory", label: "Appointments History", icon: <AppointmentIcon fontSize='small' /> },
    { path: "/coach/settings", label: "Settings", icon: <SettingsIcon fontSize='small' /> },
  ],
  clientMenuItems: [
    { path: "/client/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize='small' /> },
    { path: "/client/profile", label: "Profile", icon: <ProfileIcon fontSize='small' /> },
    { path: "/client/requestManagement", label: "Request Management", icon: <RequestIcon fontSize='small' /> },
    { path: "/client/appointmentHistory", label: "Appointments History", icon: <AppointmentIcon fontSize='small' /> },
  ]
};

export const TIMEZONES = [
  { label: "Africa/Abidjan (UTC+00:00)", value: "Africa/Abidjan" },
  { label: "Africa/Accra (UTC+00:00)", value: "Africa/Accra" },
  { label: "Africa/Addis_Ababa (UTC+03:00)", value: "Africa/Addis_Ababa" },
  { label: "Africa/Algiers (UTC+01:00)", value: "Africa/Algiers" },
  { label: "Africa/Asmara (UTC+03:00)", value: "Africa/Asmara" },
  { label: "Africa/Bamako (UTC+00:00)", value: "Africa/Bamako" },
  { label: "Africa/Bangui (UTC+01:00)", value: "Africa/Bangui" },
  { label: "Africa/Banjul (UTC+00:00)", value: "Africa/Banjul" },
  { label: "Africa/Bissau (UTC+00:00)", value: "Africa/Bissau" },
  { label: "Africa/Blantyre (UTC+02:00)", value: "Africa/Blantyre" },
  { label: "Africa/Brazzaville (UTC+01:00)", value: "Africa/Brazzaville" },
  { label: "Africa/Bujumbura (UTC+02:00)", value: "Africa/Bujumbura" },
  { label: "Africa/Cairo (UTC+02:00)", value: "Africa/Cairo" },
  { label: "Africa/Casablanca (UTC+01:00)", value: "Africa/Casablanca" },
  { label: "Africa/Ceuta (UTC+01:00)", value: "Africa/Ceuta" },
  { label: "Africa/Conakry (UTC+00:00)", value: "Africa/Conakry" },
  { label: "Africa/Dakar (UTC+00:00)", value: "Africa/Dakar" },
  { label: "Africa/Dar_es_Salaam (UTC+03:00)", value: "Africa/Dar_es_Salaam" },
  { label: "Africa/Djibouti (UTC+03:00)", value: "Africa/Djibouti" },
  { label: "Africa/Douala (UTC+01:00)", value: "Africa/Douala" },
  { label: "Africa/El_Aaiun (UTC+00:00)", value: "Africa/El_Aaiun" },
  { label: "Africa/Freetown (UTC+00:00)", value: "Africa/Freetown" },
  { label: "Africa/Gaborone (UTC+02:00)", value: "Africa/Gaborone" },
  { label: "Africa/Harare (UTC+02:00)", value: "Africa/Harare" },
  { label: "Africa/Johannesburg (UTC+02:00)", value: "Africa/Johannesburg" },
  { label: "Africa/Juba (UTC+03:00)", value: "Africa/Juba" },
  { label: "Africa/Kampala (UTC+03:00)", value: "Africa/Kampala" },
  { label: "Africa/Khartoum (UTC+02:00)", value: "Africa/Khartoum" },
  { label: "Africa/Kigali (UTC+02:00)", value: "Africa/Kigali" },
  { label: "Africa/Kinshasa (UTC+01:00)", value: "Africa/Kinshasa" },
  { label: "Africa/Lagos (UTC+01:00)", value: "Africa/Lagos" },
  { label: "Africa/Libreville (UTC+01:00)", value: "Africa/Libreville" },
  { label: "Africa/Lome (UTC+00:00)", value: "Africa/Lome" },
  { label: "Africa/Luanda (UTC+01:00)", value: "Africa/Luanda" },
  { label: "Africa/Lubumbashi (UTC+02:00)", value: "Africa/Lubumbashi" },
  { label: "Africa/Lusaka (UTC+02:00)", value: "Africa/Lusaka" },
  { label: "Africa/Malabo (UTC+01:00)", value: "Africa/Malabo" },
  { label: "Africa/Maputo (UTC+02:00)", value: "Africa/Maputo" },
  { label: "Africa/Maseru (UTC+02:00)", value: "Africa/Maseru" },
  { label: "Africa/Mbabane (UTC+02:00)", value: "Africa/Mbabane" },
  { label: "Africa/Mogadishu (UTC+03:00)", value: "Africa/Mogadishu" },
  { label: "Africa/Monrovia (UTC+00:00)", value: "Africa/Monrovia" },
  { label: "Africa/Nairobi (UTC+03:00)", value: "Africa/Nairobi" },
  { label: "Africa/Ndjamena (UTC+01:00)", value: "Africa/Ndjamena" },
  { label: "Africa/Niamey (UTC+01:00)", value: "Africa/Niamey" },
  { label: "Africa/Nouakchott (UTC+00:00)", value: "Africa/Nouakchott" },
  { label: "Africa/Ouagadougou (UTC+00:00)", value: "Africa/Ouagadougou" },
  { label: "Africa/Porto-Novo (UTC+01:00)", value: "Africa/Porto-Novo" },
  { label: "Africa/Sao_Tome (UTC+00:00)", value: "Africa/Sao_Tome" },
  { label: "Africa/Tripoli (UTC+02:00)", value: "Africa/Tripoli" },
  { label: "Africa/Tunis (UTC+01:00)", value: "Africa/Tunis" },
  { label: "Africa/Windhoek (UTC+02:00)", value: "Africa/Windhoek" },

  // AMERICA
  { label: "America/New_York (UTC-05:00)", value: "America/New_York" },
  { label: "America/Chicago (UTC-06:00)", value: "America/Chicago" },
  { label: "America/Denver (UTC-07:00)", value: "America/Denver" },
  { label: "America/Los_Angeles (UTC-08:00)", value: "America/Los_Angeles" },
  { label: "America/Toronto (UTC-05:00)", value: "America/Toronto" },
  { label: "America/Vancouver (UTC-08:00)", value: "America/Vancouver" },
  { label: "America/Sao_Paulo (UTC-03:00)", value: "America/Sao_Paulo" },
  { label: "America/Mexico_City (UTC-06:00)", value: "America/Mexico_City" },
  { label: "America/Bogota (UTC-05:00)", value: "America/Bogota" },
  { label: "America/Lima (UTC-05:00)", value: "America/Lima" },
  { label: "America/Santiago (UTC-04:00)", value: "America/Santiago" },
  { label: "America/Buenos_Aires (UTC-03:00)", value: "America/Buenos_Aires" },

  // ASIA
  { label: "Asia/Kolkata (UTC+05:30)", value: "Asia/Kolkata" },
  { label: "Asia/Kuala_Lumpur (UTC+08:00)", value: "Asia/Kuala_Lumpur" },
  { label: "Asia/Manila (UTC+08:00)", value: "Asia/Manila" },
  { label: "Asia/Hong_Kong (UTC+08:00)", value: "Asia/Hong_Kong" },
  { label: "Asia/Singapore (UTC+08:00)", value: "Asia/Singapore" },
  { label: "Asia/Shanghai (UTC+08:00)", value: "Asia/Shanghai" },
  { label: "Asia/Tokyo (UTC+09:00)", value: "Asia/Tokyo" },
  { label: "Asia/Seoul (UTC+09:00)", value: "Asia/Seoul" },
  { label: "Asia/Dubai (UTC+04:00)", value: "Asia/Dubai" },
  { label: "Asia/Qatar (UTC+03:00)", value: "Asia/Qatar" },
  { label: "Asia/Riyadh (UTC+03:00)", value: "Asia/Riyadh" },
  { label: "Asia/Tehran (UTC+03:30)", value: "Asia/Tehran" },
  { label: "Asia/Jakarta (UTC+07:00)", value: "Asia/Jakarta" },
  { label: "Asia/Kathmandu (UTC+05:45)", value: "Asia/Kathmandu" },

  // EUROPE
  { label: "Europe/London (UTC+00:00)", value: "Europe/London" },
  { label: "Europe/Berlin (UTC+01:00)", value: "Europe/Berlin" },
  { label: "Europe/Paris (UTC+01:00)", value: "Europe/Paris" },
  { label: "Europe/Madrid (UTC+01:00)", value: "Europe/Madrid" },
  { label: "Europe/Rome (UTC+01:00)", value: "Europe/Rome" },
  { label: "Europe/Amsterdam (UTC+01:00)", value: "Europe/Amsterdam" },
  { label: "Europe/Oslo (UTC+01:00)", value: "Europe/Oslo" },
  { label: "Europe/Stockholm (UTC+01:00)", value: "Europe/Stockholm" },
  { label: "Europe/Moscow (UTC+03:00)", value: "Europe/Moscow" },

  // AUSTRALIA
  { label: "Australia/Sydney (UTC+10:00)", value: "Australia/Sydney" },
  { label: "Australia/Melbourne (UTC+10:00)", value: "Australia/Melbourne" },
  { label: "Australia/Brisbane (UTC+10:00)", value: "Australia/Brisbane" },
  { label: "Australia/Perth (UTC+08:00)", value: "Australia/Perth" },

  // PACIFIC
  { label: "Pacific/Auckland (UTC+12:00)", value: "Pacific/Auckland" },
  { label: "Pacific/Fiji (UTC+12:00)", value: "Pacific/Fiji" },
  { label: "Pacific/Honolulu (UTC-10:00)", value: "Pacific/Honolulu" },
  { label: "Pacific/Guam (UTC+10:00)", value: "Pacific/Guam" }
];

// Coaching Credentials
export const coachingCredentials = [
  { value: "ICF ACC", label: "ICF ACC" },
  { value: "ICF PCC", label: "ICF PCC" },
  { value: "ICF MCC", label: "ICF MCC" },
  { value: "EMCC", label: " EMCC" },
  { value: "Co-Active", label: "Co-Active (CTI)" },
  { value: "None", label: "None" },
]

// Coaching Hours (Radio)
export const coachingHours = [
  { value: 0, label: "0-100" },
  { value: 1, label: "100-500" },
  { value: 2, label: "500-1,000" },
  { value: 3, label: "1,000+" },
];

// Industries Checkbox
export const industriesList = [
  { value: "Biopharma", label: "Biopharma" },
  { value: "Tech", label: "Tech" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Government", label: "Government" },
  { value: "Startup", label: "Startup" },
];

// Leadership Levels
export const leadershipLevels = [
  { value: "Early Career", label: "Early Career" },
  { value: "Mid Career", label: "Mid Career" },
  { value: "Executive", label: "Executive" },
  { value: "Business Owner", label: "Business Owner" },
];

// Client Situations
export const clientSituations = [
  { value: "Therapy/crisis", label: "Therapy/crisis" },
  { value: "Trauma/mental health", label: "Trauma/mental health" },
  { value: "HR-mandated", label: "HR-mandated" },
  { value: "Job search", label: "Job search" },
  { value: "Non-industry clients", label: "Non-industry clients" },
];

// Session Rates
export const sessionRates = [
  { value: "Less than $100", label: "Less than $100" },
  { value: "$100-$250", label: "$100-$250" },
  { value: "$250-$400", label: "$250-$400" },
  { value: "$400+", label: "$400+" },
  { value: "open to discussion", label: "Open to discussion" },
];

export const coachingStyle = [
  { value: "Collaborative / Exploratory", label: "Collaborative / Exploratory" },
  { value: "Structured / Model-based", label: "Structured / Model-based" },
  { value: "Somatic / Experiential", label: "Somatic / Experiential" },
  { value: "Transformational / Mindset-oriented", label: "Transformational / Mindset-oriented" },
  {value:"Don't know", label: "Don't know" }
];

export const industry = [
  { "label": "Biopharma", "value": "Biopharma" },
  { "label": "Tech", "value": "Tech" },
  { "label": "Healthcare", "value": "Healthcare" },
  { "label": "Non-profit", "value": "Non-profit" },
  { "label": "Government", "value": "Government" },
  { "label": "Startups", "value": "Startups" },
]

export const coachingGoals = [
  { "label": "Personal growth & confidence", "value": "Personal growth & confidence" },
  { "label": "Communication & relationships", "value": "Communication & relationships" },
  { "label": "Decision-making & clarity", "value": "Decision-making & clarity" },
  { "label": "Career growth & transitions", "value": "Career growth & transitions" },
  { "label": "Leadership presence & influence", "value": "Leadership presence & influence" },
  { "label": "Leading through change and uncertainty", "value": "Leading through change and uncertainty" },
  { "label": "Resilience & well-being", "value": "Resilience & well-being" },
]

export const defaultRadio = [
  { "label": "Yes", "value": 1 },
  { "label": "No", "value": 0 }
]

export const urgency = [
  { "label": "Start Now", "value": 0 },
  { "label": "Weeks", "value": 1 },
  { "label": "Exploring", "value": 2 }
]

export const workingSpectrum = [
  { "label": "Direct <-> Reflective", "value": "Direct <-> Reflective" },
  { "label": "Structured <-> Flexible", "value": "Structured <-> Flexible" },
  { "label": "Tactical <-> Strategic", "value": "tactical_strategic" },
  { "label": "Talking <-> Thinking", "value": "talking_thinking" }
]

export const motivation = [
  { "label": "Direct <-> Reflective", "value": "Direct <-> Reflective" },
  { "label": "Structured <-> Flexible", "value": "Structured <-> Flexible" },
  { "label": "Tactical <-> Strategic", "value": "Tactical <-> Strategic" },
  { "label": "Talking <-> Thinking", "value": "Talking <-> Thinking" }
]

export const engagement = [
  { "label": "Single meeting", "value": "Single meeting" },
  { "label": "Multi-session", "value": "Multi-session" },
  { "label": "Ongoing engagement", "value": "Ongoing engagement" }
]

export const preferredCoach = [
  { "label": "0–100 hours | Emerging", "value": 0 },
  { "label": "100–500 hours | Developing", "value": 1 },
  { "label": "500–1,000 hours | Experienced", "value": 2 },
  { "label": "1,000+ hours | Seasoned", "value": 3 },
  { "label": "No preference", "value": 4 }
]

export const coachCredentials = [
  { "label": "ICF ACC", "value": "ICF ACC" },
  { "label": "PCC", "value": "PCC" },
  { "label": "MCC or equivalent", "value": "MCC or equivalent" },
  { "label": "Yes, Preferred but not required", "value": "Yes, Preferred but not required" },
  { "label": "No preference", "value": "No preference" }
]

export const budget = [
  { "label": "Less than $100", "value": "Less than $100" },
  { "label": "$100–$250", "value": "$100–$250" },
  { "label": "$250–$400", "value": "$250–$400" },
  { "label": "$400+", "value": "$400+" },
  { "label": "I'm not sure yet", "value": "I'm not sure yet" }
]

export const topics = [
  { "label": "Personal Issues", "value": "Personal Issues" },
  { "label": "Work Politics", "value": "Work Politics" },
  { "label": "Past Experience", "value": "Past Experience" },
]

// Coach Status for filter dropdown
export const coachPaidStatus = [
  { label: "Scheduled", value: 2 },
  { label: "Paid", value: 1 },
  { label: "Due", value: 0 }
]

// Appointment filter dropdown
export const appointmentFilter = [
  { label: "All", value: 0 },
  { label: "Upcoming", value: 1 },
  { label: "Past", value: 2 }
];

// Month for filter dropdown in Subscriptions 
export const month = [
  { "label": "January", "value": 1 },
  { "label": "February", "value": 2 },
  { "label": "March", "value": 3 },
  { "label": "April", "value": 4 },
  { "label": "May", "value": 5 },
  { "label": "June", "value": 6 },
  { "label": "July", "value": 7 },
  { "label": "August", "value": 8 },
  { "label": "September", "value": 9 },
  { "label": "October", "value": 10 },
  { "label": "November", "value": 11 },
  { "label": "December", "value": 12 }
]

export const credentialFileMap = {
  "ICF ACC": "acc_upload_file",
  "ICF PCC": "pcc_upload_file",
  "ICF MCC": "mcc_upload_file",
  "EMCC": "emcc_upload_file",
  "Co-Active": "co_active_upload_file",
  "other": "other_upload_file"
} as const;

export const countries = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  {
    code: 'AE',
    label: 'United Arab Emirates',
    phone: '971',
  },
  { code: 'AF', label: 'Afghanistan', phone: '93' },
  {
    code: 'AG',
    label: 'Antigua and Barbuda',
    phone: '1-268',
  },
  { code: 'AI', label: 'Anguilla', phone: '1-264' },
  { code: 'AL', label: 'Albania', phone: '355' },
  { code: 'AM', label: 'Armenia', phone: '374' },
  { code: 'AO', label: 'Angola', phone: '244' },
  { code: 'AQ', label: 'Antarctica', phone: '672' },
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'AS', label: 'American Samoa', phone: '1-684' },
  { code: 'AT', label: 'Austria', phone: '43' },
  {
    code: 'AU',
    label: 'Australia',
    phone: '61',
    suggested: true,
  },
  { code: 'AW', label: 'Aruba', phone: '297' },
  { code: 'AX', label: 'Alland Islands', phone: '358' },
  { code: 'AZ', label: 'Azerbaijan', phone: '994' },
  {
    code: 'BA',
    label: 'Bosnia and Herzegovina',
    phone: '387',
  },
  { code: 'BB', label: 'Barbados', phone: '1-246' },
  { code: 'BD', label: 'Bangladesh', phone: '880' },
  { code: 'BE', label: 'Belgium', phone: '32' },
  { code: 'BF', label: 'Burkina Faso', phone: '226' },
  { code: 'BG', label: 'Bulgaria', phone: '359' },
  { code: 'BH', label: 'Bahrain', phone: '973' },
  { code: 'BI', label: 'Burundi', phone: '257' },
  { code: 'BJ', label: 'Benin', phone: '229' },
  { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
  { code: 'BM', label: 'Bermuda', phone: '1-441' },
  { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
  { code: 'BO', label: 'Bolivia', phone: '591' },
  { code: 'BR', label: 'Brazil', phone: '55' },
  { code: 'BS', label: 'Bahamas', phone: '1-242' },
  { code: 'BT', label: 'Bhutan', phone: '975' },
  { code: 'BV', label: 'Bouvet Island', phone: '47' },
  { code: 'BW', label: 'Botswana', phone: '267' },
  { code: 'BY', label: 'Belarus', phone: '375' },
  { code: 'BZ', label: 'Belize', phone: '501' },
  {
    code: 'CA',
    label: 'Canada',
    phone: '1',
    suggested: true,
  },
  {
    code: 'CC',
    label: 'Cocos (Keeling) Islands',
    phone: '61',
  },
  {
    code: 'CD',
    label: 'Congo, Democratic Republic of the',
    phone: '243',
  },
  {
    code: 'CF',
    label: 'Central African Republic',
    phone: '236',
  },
  {
    code: 'CG',
    label: 'Congo, Republic of the',
    phone: '242',
  },
  { code: 'CH', label: 'Switzerland', phone: '41' },
  { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
  { code: 'CK', label: 'Cook Islands', phone: '682' },
  { code: 'CL', label: 'Chile', phone: '56' },
  { code: 'CM', label: 'Cameroon', phone: '237' },
  { code: 'CN', label: 'China', phone: '86' },
  { code: 'CO', label: 'Colombia', phone: '57' },
  { code: 'CR', label: 'Costa Rica', phone: '506' },
  { code: 'CU', label: 'Cuba', phone: '53' },
  { code: 'CV', label: 'Cape Verde', phone: '238' },
  { code: 'CW', label: 'Curacao', phone: '599' },
  { code: 'CX', label: 'Christmas Island', phone: '61' },
  { code: 'CY', label: 'Cyprus', phone: '357' },
  { code: 'CZ', label: 'Czech Republic', phone: '420' },
  {
    code: 'DE',
    label: 'Germany',
    phone: '49',
    suggested: true,
  },
  { code: 'DJ', label: 'Djibouti', phone: '253' },
  { code: 'DK', label: 'Denmark', phone: '45' },
  { code: 'DM', label: 'Dominica', phone: '1-767' },
  {
    code: 'DO',
    label: 'Dominican Republic',
    phone: '1-809',
  },
  { code: 'DZ', label: 'Algeria', phone: '213' },
  { code: 'EC', label: 'Ecuador', phone: '593' },
  { code: 'EE', label: 'Estonia', phone: '372' },
  { code: 'EG', label: 'Egypt', phone: '20' },
  { code: 'EH', label: 'Western Sahara', phone: '212' },
  { code: 'ER', label: 'Eritrea', phone: '291' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'ET', label: 'Ethiopia', phone: '251' },
  { code: 'FI', label: 'Finland', phone: '358' },
  { code: 'FJ', label: 'Fiji', phone: '679' },
  {
    code: 'FK',
    label: 'Falkland Islands (Malvinas)',
    phone: '500',
  },
  {
    code: 'FM',
    label: 'Micronesia, Federated States of',
    phone: '691',
  },
  { code: 'FO', label: 'Faroe Islands', phone: '298' },
  {
    code: 'FR',
    label: 'France',
    phone: '33',
    suggested: true,
  },
  { code: 'GA', label: 'Gabon', phone: '241' },
  { code: 'GB', label: 'United Kingdom', phone: '44' },
  { code: 'GD', label: 'Grenada', phone: '1-473' },
  { code: 'GE', label: 'Georgia', phone: '995' },
  { code: 'GF', label: 'French Guiana', phone: '594' },
  { code: 'GG', label: 'Guernsey', phone: '44' },
  { code: 'GH', label: 'Ghana', phone: '233' },
  { code: 'GI', label: 'Gibraltar', phone: '350' },
  { code: 'GL', label: 'Greenland', phone: '299' },
  { code: 'GM', label: 'Gambia', phone: '220' },
  { code: 'GN', label: 'Guinea', phone: '224' },
  { code: 'GP', label: 'Guadeloupe', phone: '590' },
  { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
  { code: 'GR', label: 'Greece', phone: '30' },
  {
    code: 'GS',
    label: 'South Georgia and the South Sandwich Islands',
    phone: '500',
  },
  { code: 'GT', label: 'Guatemala', phone: '502' },
  { code: 'GU', label: 'Guam', phone: '1-671' },
  { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
  { code: 'GY', label: 'Guyana', phone: '592' },
  { code: 'HK', label: 'Hong Kong', phone: '852' },
  {
    code: 'HM',
    label: 'Heard Island and McDonald Islands',
    phone: '672',
  },
  { code: 'HN', label: 'Honduras', phone: '504' },
  { code: 'HR', label: 'Croatia', phone: '385' },
  { code: 'HT', label: 'Haiti', phone: '509' },
  { code: 'HU', label: 'Hungary', phone: '36' },
  { code: 'ID', label: 'Indonesia', phone: '62' },
  { code: 'IE', label: 'Ireland', phone: '353' },
  { code: 'IL', label: 'Israel', phone: '972' },
  { code: 'IM', label: 'Isle of Man', phone: '44' },
  { code: 'IN', label: 'India', phone: '91' },
  {
    code: 'IO',
    label: 'British Indian Ocean Territory',
    phone: '246',
  },
  { code: 'IQ', label: 'Iraq', phone: '964' },
  {
    code: 'IR',
    label: 'Iran, Islamic Republic of',
    phone: '98',
  },
  { code: 'IS', label: 'Iceland', phone: '354' },
  { code: 'IT', label: 'Italy', phone: '39' },
  { code: 'JE', label: 'Jersey', phone: '44' },
  { code: 'JM', label: 'Jamaica', phone: '1-876' },
  { code: 'JO', label: 'Jordan', phone: '962' },
  {
    code: 'JP',
    label: 'Japan',
    phone: '81',
    suggested: true,
  },
  { code: 'KE', label: 'Kenya', phone: '254' },
  { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
  { code: 'KH', label: 'Cambodia', phone: '855' },
  { code: 'KI', label: 'Kiribati', phone: '686' },
  { code: 'KM', label: 'Comoros', phone: '269' },
  {
    code: 'KN',
    label: 'Saint Kitts and Nevis',
    phone: '1-869',
  },
  {
    code: 'KP',
    label: "Korea, Democratic People's Republic of",
    phone: '850',
  },
  { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  { code: 'KW', label: 'Kuwait', phone: '965' },
  { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
  { code: 'KZ', label: 'Kazakhstan', phone: '7' },
  {
    code: 'LA',
    label: "Lao People's Democratic Republic",
    phone: '856',
  },
  { code: 'LB', label: 'Lebanon', phone: '961' },
  { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
  { code: 'LI', label: 'Liechtenstein', phone: '423' },
  { code: 'LK', label: 'Sri Lanka', phone: '94' },
  { code: 'LR', label: 'Liberia', phone: '231' },
  { code: 'LS', label: 'Lesotho', phone: '266' },
  { code: 'LT', label: 'Lithuania', phone: '370' },
  { code: 'LU', label: 'Luxembourg', phone: '352' },
  { code: 'LV', label: 'Latvia', phone: '371' },
  { code: 'LY', label: 'Libya', phone: '218' },
  { code: 'MA', label: 'Morocco', phone: '212' },
  { code: 'MC', label: 'Monaco', phone: '377' },
  {
    code: 'MD',
    label: 'Moldova, Republic of',
    phone: '373',
  },
  { code: 'ME', label: 'Montenegro', phone: '382' },
  {
    code: 'MF',
    label: 'Saint Martin (French part)',
    phone: '590',
  },
  { code: 'MG', label: 'Madagascar', phone: '261' },
  { code: 'MH', label: 'Marshall Islands', phone: '692' },
  {
    code: 'MK',
    label: 'Macedonia, the Former Yugoslav Republic of',
    phone: '389',
  },
  { code: 'ML', label: 'Mali', phone: '223' },
  { code: 'MM', label: 'Myanmar', phone: '95' },
  { code: 'MN', label: 'Mongolia', phone: '976' },
  { code: 'MO', label: 'Macao', phone: '853' },
  {
    code: 'MP',
    label: 'Northern Mariana Islands',
    phone: '1-670',
  },
  { code: 'MQ', label: 'Martinique', phone: '596' },
  { code: 'MR', label: 'Mauritania', phone: '222' },
  { code: 'MS', label: 'Montserrat', phone: '1-664' },
  { code: 'MT', label: 'Malta', phone: '356' },
  { code: 'MU', label: 'Mauritius', phone: '230' },
  { code: 'MV', label: 'Maldives', phone: '960' },
  { code: 'MW', label: 'Malawi', phone: '265' },
  { code: 'MX', label: 'Mexico', phone: '52' },
  { code: 'MY', label: 'Malaysia', phone: '60' },
  { code: 'MZ', label: 'Mozambique', phone: '258' },
  { code: 'NA', label: 'Namibia', phone: '264' },
  { code: 'NC', label: 'New Caledonia', phone: '687' },
  { code: 'NE', label: 'Niger', phone: '227' },
  { code: 'NF', label: 'Norfolk Island', phone: '672' },
  { code: 'NG', label: 'Nigeria', phone: '234' },
  { code: 'NI', label: 'Nicaragua', phone: '505' },
  { code: 'NL', label: 'Netherlands', phone: '31' },
  { code: 'NO', label: 'Norway', phone: '47' },
  { code: 'NP', label: 'Nepal', phone: '977' },
  { code: 'NR', label: 'Nauru', phone: '674' },
  { code: 'NU', label: 'Niue', phone: '683' },
  { code: 'NZ', label: 'New Zealand', phone: '64' },
  { code: 'OM', label: 'Oman', phone: '968' },
  { code: 'PA', label: 'Panama', phone: '507' },
  { code: 'PE', label: 'Peru', phone: '51' },
  { code: 'PF', label: 'French Polynesia', phone: '689' },
  { code: 'PG', label: 'Papua New Guinea', phone: '675' },
  { code: 'PH', label: 'Philippines', phone: '63' },
  { code: 'PK', label: 'Pakistan', phone: '92' },
  { code: 'PL', label: 'Poland', phone: '48' },
  {
    code: 'PM',
    label: 'Saint Pierre and Miquelon',
    phone: '508',
  },
  { code: 'PN', label: 'Pitcairn', phone: '870' },
  { code: 'PR', label: 'Puerto Rico', phone: '1' },
  {
    code: 'PS',
    label: 'Palestine, State of',
    phone: '970',
  },
  { code: 'PT', label: 'Portugal', phone: '351' },
  { code: 'PW', label: 'Palau', phone: '680' },
  { code: 'PY', label: 'Paraguay', phone: '595' },
  { code: 'QA', label: 'Qatar', phone: '974' },
  { code: 'RE', label: 'Reunion', phone: '262' },
  { code: 'RO', label: 'Romania', phone: '40' },
  { code: 'RS', label: 'Serbia', phone: '381' },
  { code: 'RU', label: 'Russian Federation', phone: '7' },
  { code: 'RW', label: 'Rwanda', phone: '250' },
  { code: 'SA', label: 'Saudi Arabia', phone: '966' },
  { code: 'SB', label: 'Solomon Islands', phone: '677' },
  { code: 'SC', label: 'Seychelles', phone: '248' },
  { code: 'SD', label: 'Sudan', phone: '249' },
  { code: 'SE', label: 'Sweden', phone: '46' },
  { code: 'SG', label: 'Singapore', phone: '65' },
  { code: 'SH', label: 'Saint Helena', phone: '290' },
  { code: 'SI', label: 'Slovenia', phone: '386' },
  {
    code: 'SJ',
    label: 'Svalbard and Jan Mayen',
    phone: '47',
  },
  { code: 'SK', label: 'Slovakia', phone: '421' },
  { code: 'SL', label: 'Sierra Leone', phone: '232' },
  { code: 'SM', label: 'San Marino', phone: '378' },
  { code: 'SN', label: 'Senegal', phone: '221' },
  { code: 'SO', label: 'Somalia', phone: '252' },
  { code: 'SR', label: 'Suriname', phone: '597' },
  { code: 'SS', label: 'South Sudan', phone: '211' },
  {
    code: 'ST',
    label: 'Sao Tome and Principe',
    phone: '239',
  },
  { code: 'SV', label: 'El Salvador', phone: '503' },
  {
    code: 'SX',
    label: 'Sint Maarten (Dutch part)',
    phone: '1-721',
  },
  {
    code: 'SY',
    label: 'Syrian Arab Republic',
    phone: '963',
  },
  { code: 'SZ', label: 'Swaziland', phone: '268' },
  {
    code: 'TC',
    label: 'Turks and Caicos Islands',
    phone: '1-649',
  },
  { code: 'TD', label: 'Chad', phone: '235' },
  {
    code: 'TF',
    label: 'French Southern Territories',
    phone: '262',
  },
  { code: 'TG', label: 'Togo', phone: '228' },
  { code: 'TH', label: 'Thailand', phone: '66' },
  { code: 'TJ', label: 'Tajikistan', phone: '992' },
  { code: 'TK', label: 'Tokelau', phone: '690' },
  { code: 'TL', label: 'Timor-Leste', phone: '670' },
  { code: 'TM', label: 'Turkmenistan', phone: '993' },
  { code: 'TN', label: 'Tunisia', phone: '216' },
  { code: 'TO', label: 'Tonga', phone: '676' },
  { code: 'TR', label: 'Turkey', phone: '90' },
  {
    code: 'TT',
    label: 'Trinidad and Tobago',
    phone: '1-868',
  },
  { code: 'TV', label: 'Tuvalu', phone: '688' },
  {
    code: 'TW',
    label: 'Taiwan',
    phone: '886',
  },
  {
    code: 'TZ',
    label: 'United Republic of Tanzania',
    phone: '255',
  },
  { code: 'UA', label: 'Ukraine', phone: '380' },
  { code: 'UG', label: 'Uganda', phone: '256' },
  {
    code: 'US',
    label: 'United States',
    phone: '1',
    suggested: true,
  },
  { code: 'UY', label: 'Uruguay', phone: '598' },
  { code: 'UZ', label: 'Uzbekistan', phone: '998' },
  {
    code: 'VA',
    label: 'Holy See (Vatican City State)',
    phone: '379',
  },
  {
    code: 'VC',
    label: 'Saint Vincent and the Grenadines',
    phone: '1-784',
  },
  { code: 'VE', label: 'Venezuela', phone: '58' },
  {
    code: 'VG',
    label: 'British Virgin Islands',
    phone: '1-284',
  },
  {
    code: 'VI',
    label: 'US Virgin Islands',
    phone: '1-340',
  },
  { code: 'VN', label: 'Vietnam', phone: '84' },
  { code: 'VU', label: 'Vanuatu', phone: '678' },
  { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
  { code: 'WS', label: 'Samoa', phone: '685' },
  { code: 'XK', label: 'Kosovo', phone: '383' },
  { code: 'YE', label: 'Yemen', phone: '967' },
  { code: 'YT', label: 'Mayotte', phone: '262' },
  { code: 'ZA', label: 'South Africa', phone: '27' },
  { code: 'ZM', label: 'Zambia', phone: '260' },
  { code: 'ZW', label: 'Zimbabwe', phone: '263' },
];

export const INDUSTRY_OPTIONS = [
  { label: "Biopharma", value: "biopharma" },
  { label: "Tech", value: "tech" },
  { label: "Executives / senior leaders", value: "executives_senior_leaders" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Nonprofit", value: "nonprofit" },
  { label: "Government", value: "government" },
  { label: "Startups", value: "startups" },
  { label: "Other", value: "other" },
];

/* ================= COACHING GOALS ================= */
export const COACHING_GOALS_OPTIONS = [
  { label: "Personal Growth & Confidence", value: "personal_growth_confidence" },
  { label: "Communication & Relationships", value: "communication_relationships" },
  { label: "Decision-Making & Clarity", value: "decision_making_clarity" },
  { label: "Career Growth & Transitions", value: "career_growth_transitions" },
  { label: "Leadership Presence & Influence", value: "leadership_presence_influence" },
  { label: "Leading through change and uncertainty", value: "leading_change_uncertainty" },
  { label: "Resilience & Well-being", value: "resilience_wellbeing" },
  { label: "Equity, inclusion, & Impact Leadership", value: "equity_inclusion_impact_leadership" },
];

/* ================= YES / NO ================= */
export const DEFAULT_RADIO_OPTIONS = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

/* ================= URGENCY ================= */
export const URGENCY_OPTIONS = [
  {
    label: "I'm ready to start now",
    value: 0,
  },
  {
    label: "Within the next few weeks",
    value: 1,
  },
  {
    label: "I'm exploring options",
    value: 2,
  },
];
/* ================= WORKING SPECTRUM ================= */
export const WORKING_STYLE_OPTIONS = [
  {
    label: "Collaborative / Exploratory",
    value: "Collaborative / Exploratory",
  },
  {
    label: "Structured / Model-based",
    value: "Structured / Model-based",
  },
  {
    label: "Somatic / Experiential",
    value: "Somatic / Experiential",
  },
  {
    label: "Transformational / Mindset-Oriented",
    value: "Transformational / Mindset-Oriented",
  },{
    label: "Don't know",
    value: "Don't know",
  }
];


/* ================= MOTIVATION ================= */
export const MOTIVATION_OPTIONS = [
  { label: "Direct <-> Reflective", value: "direct_reflective" },
  { label: "Structured <-> Flexible", value: "structured_flexible" },
  { label: "Tactical <-> Strategic", value: "tactical_strategic" },
  { label: "Talking <-> Thinking", value: "talking_thinking" },
];

/* ================= ENGAGEMENT ================= */
export const ENGAGEMENT_OPTIONS = [
  { label: "Single meeting", value: 1 },
  { label: "Multi-session", value: 2 },
  { label: "Ongoing engagement", value: 3 },
  { label: "Other", value: 4 },
];
export const REFERRAL_SOURCE_OPTIONS = [
  {
    label: "Referral from a friend or colleague",
    value: "Referral from a friend or colleague",
  },
  {
    label: "Referred by a coach",
    value: "Referred by a coach",
  },
  {
    label: "LinkedIn",
    value: "LinkedIn",
  },
  {
    label: "Instagram",
    value: "Instagram",
  },
  {
    label: "Google search",
    value: "Google search",
  },
  {
    label: "Event or workshop",
    value: "Event or workshop",
  },
  {
    label: "Other",
    value: "Other",
  },
];


/* ================= PREFERRED COACH EXPERIENCE ================= */
export const PREFERRED_COACH_OPTIONS = [
  {
    label: "Newer coach",
    value: "Newer coach",
  },
  {
    label: "Moderately experienced coach",
    value: "Moderately experienced coach",
  },
  {
    label: "Highly experienced coach",
    value: "Highly experienced coach",
  },
  {
    label: "No preference",
    value: "No preference",
  },
];

/* ================= COACH CREDENTIALS ================= */

export const COACH_CREDENTIALS_OPTIONS = [
  {
    label: "ICF ACC",
    value: "ICF ACC",
  },
  {
    label: "ICF PCC",
    value: "ICF PCC",
  },
  {
    label: "ICF MCC",
    value: "ICF MCC",
  },
  {
    label: "EMCC (all levels)",
    value: "EMCC (all levels)",
  },
  {
    label: "Co-Active (CPCC)",
    value: "Co-Active (CPCC)",
  },

];

/* ================= BUDGET ================= */
export const BUDGET_OPTIONS = [
  { label: "Less than $100", value: "less_than_100" },
  { label: "$100–$250", value: "100_250" },
  { label: "$250–$400", value: "250_400" },
  { label: "$400+", value: "400_plus" },
  { label: "I'm not sure yet", value: "not_sure" },
  { label: "Flexiable", value: "flexable" },
];

/* ================= TOPICS ================= */
export const TOPIC_OPTIONS = [
  { label: "Personal Issues", value: "personal_issues" },
  { label: "Work Politics", value: "work_politics" },
  { label: "Past Experience", value: "past_experience" },
];

/* ================= Feedback Start ================= */
export const coachUnderstanding = [
  { label: "Not really", value: 1 },
  { label: "Somewhat understood", value: 2 },
  { label: "Mostly understood", value: 3 },
  { label: "Fully understood", value: 4 },
];
 
export const styleAndApproach = [
  { label: "Not a fit", value: 1 },
  { label: "Not sure yet", value: 2 },
  { label: "Good fit", value: 3 },
  { label: "Excellent fit", value: 4 },
];
 
export const feltSupported = [
  { label: "Not really", value: 1 },
  { label: "Somewhat", value: 2 },
  { label: "Mostly", value: 3 },
  { label: "Yes, completely", value: 4 },
];
 
export const coachComfortLevel = [
  { label: "Uncomfortable", value: 1 },
  { label: "Neutral", value: 2 },
  { label: "Comfortable", value: 3 },
  { label: "Very comfortable", value: 4 },
];
 
export const likeToProceed = [
  { label: "Unlikely", value: 1 },
  { label: "Unsure", value: 2 },
  { label: "Likely", value: 3 },
  { label: "Very likely", value: 4 },
];
 
export const effectiveness = [
  { label: "Not effective", value: 1 },
  { label: "Sightly effective", value: 2 },
  { label: "Moderately effective", value: 3 },
  { label: "Very effective", value: 4 },
  { label: "Extremely effective", value: 5 },
];
 
export const styleFitOverTime = [
  { label: "Not a fit", value: 1 },
  { label: "Mixed fit", value: 2 },
  { label: "Good fit overall", value: 3 },
  { label: "Excellent fit throughout", value: 4 },
];
 
/* ================= Feedback End ================= */
 