package db

import (
	"fmt"
	"notification-scheduler/internal/domain"
	"notification-scheduler/internal/notificationer/db/internal/item"
	"notification-scheduler/internal/utils"
)

type NotificationsDB struct {
	db  map[string][]item.NotificationItem
	err error
}

func NewNotificationsDB(err error) *NotificationsDB {
	db := make(map[string][]item.NotificationItem)
	return &NotificationsDB{
		db:  db,
		err: err,
	}
}

func (notifDB *NotificationsDB) CreateNotifications(notification domain.Notification) ([]domain.Notification, error) {
	var createdNotifications []domain.Notification
	for _, hour := range notification.Hours {
		if !utils.ValidHour(hour) {
			return nil, fmt.Errorf("error creating notifications: invalid key")
		}

		if len(hour) == 4 {
			hour = "0" + hour
		}

		notificationItem := item.CreateItemFromNotification(notification)
		// Save notification
		notifDB.db[hour] = append(notifDB.db[hour], notificationItem)

		// Collect notifications. These notifications have a defined ID and hour
		createdNotification := notificationItem.ToNotification()
		createdNotification.Hours = []string{hour}
		createdNotifications = append(createdNotifications, createdNotification)
	}

	return createdNotifications, nil
}

func (notifDB *NotificationsDB) GetNotificationsByEmail(email string) ([]domain.Notification, error) {
	if notifDB.err != nil {
		return nil, notifDB.err
	}

	var userNotifications []domain.Notification
	for hour, notificationsPerHour := range notifDB.db {
		for _, notifItem := range notificationsPerHour {
			if notifItem.Email == email {
				notification := notifItem.ToNotification()
				notification.Hours = []string{hour}
				userNotifications = append(userNotifications, notification)
			}
		}
	}

	return userNotifications, nil
}

func (notifDB *NotificationsDB) GetNotification(notificationID string) (*domain.Notification, error) {
	if notifDB.err != nil {
		return nil, notifDB.err
	}

	for hour, notificationsPerHour := range notifDB.db {
		for _, notifItem := range notificationsPerHour {
			if notifItem.ID == notificationID {
				notification := notifItem.ToNotification()
				notification.Hours = []string{hour}
				return &notification, nil
			}
		}
	}

	return nil, nil
}

func (notifDB *NotificationsDB) UpdateNotification(updatedNotification domain.Notification) error {
	if notifDB.err != nil {
		return notifDB.err
	}

	allNotifications, found := notifDB.db[updatedNotification.Hours[0]]
	if !found {
		return fmt.Errorf("key not found")
	}

	for idx := range allNotifications {
		if allNotifications[idx].ID == updatedNotification.ID {
			allNotifications[idx] = item.CreateItemFromNotification(updatedNotification)
			return nil
		}
	}

	return fmt.Errorf("error notification not found")
}

func (notifDB *NotificationsDB) DeleteNotification(notificationID string) (bool, error) {
	if notifDB.err != nil {
		return false, notifDB.err
	}

	deleted := false
	for key, notificationsPerHour := range notifDB.db {
		var notifItemsCopy []item.NotificationItem
		for idx := range notificationsPerHour {
			if notificationsPerHour[idx].ID == notificationID {
				deleted = true
				continue
			}
			notifItemsCopy = append(notifItemsCopy, notificationsPerHour[idx])
		}

		notifDB.db[key] = notifItemsCopy
	}

	return deleted, nil
}

func (notifDB *NotificationsDB) GetAll(key string) []domain.Notification {
	var notifications []domain.Notification

	notifItems, found := notifDB.db[key]
	if !found {
		return notifications
	}

	for idx := range notifItems {
		notification := notifItems[idx].ToNotification()
		notification.Hours = []string{key}
		notifications = append(notifications, notification)
	}

	return notifications
}
