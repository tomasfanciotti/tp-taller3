package app

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
	"notification-scheduler/internal/domain"
	"notification-scheduler/internal/externalservices/email"
	"notification-scheduler/internal/externalservices/telegram"
	"notification-scheduler/internal/notificationer/db"
	"notification-scheduler/internal/notificationer/handler"
	"notification-scheduler/internal/notificationer/service"
	"os"
	"time"
)

const portEnv = "PORT"

type appHandler interface {
	RegisterRoutes(r *gin.Engine)
	ScheduleNotification(c *gin.Context)
	GetNotifications(c *gin.Context)
	GetNotificationData(c *gin.Context)
	UpdateNotification(c *gin.Context)
	DeleteNotification(c *gin.Context)
	GetCurrentNotifications() ([]domain.Notification, error)
}

type telegramHandler interface {
	SendNotifications(notifications []domain.Notification) error
}

func loadEmailConfig() (*email.EmailConfig, error) {

	region := os.Getenv("MAIL_REGION")
	if region == "" {
		return nil, errors.New("missing region")
	}
	secretKey := os.Getenv("MAIL_SECRET_KEY")
	if secretKey == "" {
		return nil, errors.New("missing secret key")
	}
	accessKey := os.Getenv("MAIL_ACCESS_KEY")
	if accessKey == "" {
		return nil, errors.New("missing access key")
	}
	from := os.Getenv("MAIL_FROM")
	if from == "" {
		return nil, errors.New("missing from")
	}

	return &email.EmailConfig{
		Region:    region,
		AccessKey: accessKey,
		SecretKey: secretKey,
		From:      from,
	}, nil
}

type App struct {
	NotificationHandler appHandler
	Telegramer          telegramHandler
}

// NewApp initializes all dependencies that App requires
func NewApp() (*App, error) {
	// DB
	appDB := db.NewNotificationsDB(nil)

	// Service
	notificationService := service.NewNotificationService(appDB)

	// Aws Client
	emailConfig, err := loadEmailConfig()
	if err != nil {
		return nil, err
	}
	session := email.NewAwsSession(emailConfig)
	err = session.Connect()
	if err != nil {
		return nil, err
	}

	// Telegramer
	client := http.Client{Timeout: 5 * time.Second}
	telegramer := telegram.NewTelegramer(client)

	// Handler
	notificationHandler := handler.NewNotificationHandler(notificationService, &session, telegramer)

	// App
	return &App{
		NotificationHandler: notificationHandler,
		Telegramer:          telegramer,
	}, nil
}

func (a *App) RegisterRoutes(r *gin.Engine) {
	a.NotificationHandler.RegisterRoutes(r)
}

func (a *App) RunForrestRun(r *gin.Engine) error {
	errChannel := make(chan error, 1)
	go func() {
		logrus.Info("Starting Ticker")
		errChannel <- a.runTicker()
	}()

	port := os.Getenv(portEnv)
	go func() {
		logrus.Info("Starting Notificationer")
		errChannel <- r.Run(fmt.Sprintf(":%s", port))
	}()

	err := <-errChannel
	return err
}

func (a *App) runTicker() error {
	currentTime := time.Now()
	var triggerTicker time.Duration
	if currentTime.Minute() < 30 {
		diff := 30 - currentTime.Minute()
		triggerTicker = time.Duration(diff) * time.Minute
	} else {
		nextHour := time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), currentTime.Hour()+1, 0, 0, 0, currentTime.Location())
		triggerTicker = nextHour.Sub(currentTime)
	}

	logrus.Debugf("Waiting %v until the next o'clock hour", triggerTicker)
	delayTicker := time.NewTicker(triggerTicker)
	gap := 30 * time.Minute // Notifications will be sent every half hour
	notificationsTicker := time.NewTicker(gap)

	for {
		select {
		case <-delayTicker.C:
			fmt.Println("The wait is over")
			notificationsTicker.Reset(gap)
			delayTicker.Stop()
			notifications, err := a.NotificationHandler.GetCurrentNotifications()
			if err != nil {
				logrus.Errorf("error fetching notifications: %v", err)
				continue
			}

			if len(notifications) == 0 {
				logrus.Infof("There aren't notifications scheduled for the given hour: %d:%d", currentTime.Hour(), currentTime.Minute())
				continue
			}

			err = a.Telegramer.SendNotifications(notifications)
			if err != nil {
				logrus.Errorf("error sending shceduled notifications: %v", err)
			}

		case <-notificationsTicker.C:
			notifications, err := a.NotificationHandler.GetCurrentNotifications()
			if err != nil {
				logrus.Errorf("error fetching notifications: %v", err)
				continue
			}

			if len(notifications) == 0 {
				logrus.Infof("There aren't notifications scheduled for the given hour: %d:%d", currentTime.Hour(), currentTime.Minute())
				continue
			}

			err = a.Telegramer.SendNotifications(notifications)
			if err != nil {
				logrus.Errorf("error sending shceduled notifications: %v", err)
			}
		}
	}
}
