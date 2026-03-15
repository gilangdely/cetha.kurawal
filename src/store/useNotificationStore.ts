import { create } from "zustand";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: any;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  unsubscribe: (() => void) | null;
  initListener: (uid: string, isAdmin?: boolean) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  clearListener: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: true,
  unsubscribe: null,

  initListener: (uid: string, isAdmin = false) => {
    // Prevent multiple listeners
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }

    set({ isLoading: true });

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "in", isAdmin ? [uid, "admin"] : [uid])
    );

    const newUnsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("[NotifStore] Snapshot received. Docs count:", snapshot.docs.length);
        const notifs: AppNotification[] = [];
        let unread = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data.isRead) unread++;
          notifs.push({
            id: docSnap.id,
            ...data,
          } as AppNotification);
        });

        // Client-side sorting to bypass Firestore composite index requirement
        notifs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        set({
          notifications: notifs,
          unreadCount: unread,
          isLoading: false,
        });
      },
      (error) => {
        console.error("[NotifStore] Error fetching notifications:", error);
        set({ isLoading: false });
      }
    );

    set({ unsubscribe: newUnsubscribe });
  },

  markAsRead: async (notificationId: string) => {
    try {
      const docRef = doc(db, "notifications", notificationId);
      await updateDoc(docRef, {
        isRead: true,
      });
      // The onSnapshot listener will automatically update the state
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  clearListener: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    set({
      notifications: [],
      unreadCount: 0,
      unsubscribe: null,
      isLoading: false,
    });
  },
}));
