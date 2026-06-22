import { create } from 'zustand';

export type EnrollmentTargetType = 'Anonymous' | 'Listener' | 'Group';
export type EnrollmentContentType = 'Presentation' | 'Course';
export type EnrollmentStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';

export interface EnrollmentFormState {
  // General Tab
  title: string;
  targetType: EnrollmentTargetType;
  contentType: EnrollmentContentType;
  listenerId: string;
  presentationId: string;
  presenters: string[]; // Email addresses
  linkToCalendar: string;
  startDate: string | null; // ISO string
  status: EnrollmentStatus;

  // Interaction & AI
  choiceAtBeginning: boolean;
  chatAccess: boolean;
  leadGeneration: boolean;

  // Security
  expirationDate: string | null;
  viewLimits: number | null;
  passcodeProtection: boolean;
  passcode: string;
  allowDownload: boolean;

  // Invitation & Reminders Tab
  invitationSubject: string;
  invitationText: string;
  translateToListenerLanguage: boolean;
  sendAnimatedGif: boolean;
  scheduledInvitationDate: string | null; // ISO string
  
  // Reminders
  remindersEnabled: boolean;
  reminderSubject: string;
  reminderText: string;
  reminderFrequency: 'Daily' | 'Weekly' | 'Custom';
  reminderCount: number;
  stopReminders: boolean;

  // Actions
  setTitle: (title: string) => void;
  setTargetType: (type: EnrollmentTargetType) => void;
  setContentType: (type: EnrollmentContentType) => void;
  setListenerId: (id: string) => void;
  setPresentationId: (id: string) => void;
  setPresenters: (presenters: string[]) => void;
  setLinkToCalendar: (link: string) => void;
  setStartDate: (date: string | null) => void;
  setStatus: (status: EnrollmentStatus) => void;

  setChoiceAtBeginning: (val: boolean) => void;
  setChatAccess: (val: boolean) => void;
  setLeadGeneration: (val: boolean) => void;

  setExpirationDate: (date: string | null) => void;
  setViewLimits: (limits: number | null) => void;
  setPasscodeProtection: (val: boolean) => void;
  setPasscode: (passcode: string) => void;
  setAllowDownload: (val: boolean) => void;

  setInvitationSubject: (sub: string) => void;
  setInvitationText: (text: string) => void;
  setTranslateToListenerLanguage: (val: boolean) => void;
  setSendAnimatedGif: (val: boolean) => void;
  setScheduledInvitationDate: (date: string | null) => void;

  setRemindersEnabled: (val: boolean) => void;
  setReminderSubject: (sub: string) => void;
  setReminderText: (text: string) => void;
  setReminderFrequency: (freq: 'Daily' | 'Weekly' | 'Custom') => void;
  setReminderCount: (count: number) => void;
  setStopReminders: (val: boolean) => void;
  
  // Validation
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  validate: () => boolean;
}

export const useEnrollmentFormStore = create<EnrollmentFormState>((set, get) => ({
  title: '',
  targetType: 'Anonymous',
  contentType: 'Presentation',
  listenerId: '',
  presentationId: '',
  presenters: [],
  linkToCalendar: '',
  startDate: null,
  status: 'Pending',

  choiceAtBeginning: false,
  chatAccess: true,
  leadGeneration: false,

  expirationDate: null,
  viewLimits: null,
  passcodeProtection: false,
  passcode: '',
  allowDownload: false,

  invitationSubject: '',
  invitationText: '',
  translateToListenerLanguage: false,
  sendAnimatedGif: false,
  scheduledInvitationDate: null,

  remindersEnabled: false,
  reminderSubject: '',
  reminderText: '',
  reminderFrequency: 'Daily',
  reminderCount: 3,
  stopReminders: true,

  errors: {},

  setTitle: (title) => set({ title }),
  setTargetType: (targetType) => set({ targetType }),
  setContentType: (contentType) => set({ contentType }),
  setListenerId: (listenerId) => set({ listenerId }),
  setPresentationId: (presentationId) => set({ presentationId }),
  setPresenters: (presenters) => set({ presenters }),
  setLinkToCalendar: (linkToCalendar) => set({ linkToCalendar }),
  setStartDate: (startDate) => set({ startDate }),
  setStatus: (status) => set({ status }),

  setChoiceAtBeginning: (choiceAtBeginning) => set({ choiceAtBeginning }),
  setChatAccess: (chatAccess) => set({ chatAccess }),
  setLeadGeneration: (leadGeneration) => set({ leadGeneration }),

  setExpirationDate: (expirationDate) => set({ expirationDate }),
  setViewLimits: (viewLimits) => set({ viewLimits }),
  setPasscodeProtection: (passcodeProtection) => set({ passcodeProtection }),
  setPasscode: (passcode) => set({ passcode }),
  setAllowDownload: (allowDownload) => set({ allowDownload }),

  setInvitationSubject: (invitationSubject) => set({ invitationSubject }),
  setInvitationText: (invitationText) => set({ invitationText }),
  setTranslateToListenerLanguage: (translateToListenerLanguage) => set({ translateToListenerLanguage }),
  setSendAnimatedGif: (sendAnimatedGif) => set({ sendAnimatedGif }),
  setScheduledInvitationDate: (scheduledInvitationDate) => set({ scheduledInvitationDate }),

  setRemindersEnabled: (remindersEnabled) => set({ remindersEnabled }),
  setReminderSubject: (reminderSubject) => set({ reminderSubject }),
  setReminderText: (reminderText) => set({ reminderText }),
  setReminderFrequency: (reminderFrequency) => set({ reminderFrequency }),
  setReminderCount: (reminderCount) => set({ reminderCount }),
  setStopReminders: (stopReminders) => set({ stopReminders }),

  setErrors: (errors) => set({ errors }),

  validate: () => {
    const { title, targetType, listenerId, presentationId, passcodeProtection, passcode } = get();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (targetType === 'Listener' && !listenerId) {
      newErrors.listenerId = 'Listener is required';
    }

    if (!presentationId) {
      newErrors.presentationId = 'Presentation is required';
    }

    if (passcodeProtection && !passcode.trim()) {
      newErrors.passcode = 'Passcode is required when protection is enabled';
    }

    set({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }
}));
