package config

import (
	"drugs/src/utils"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"os"
	"strconv"
)

var config Config

const (
	TreatmentUrl   = "DB_URL"
	Port           = "PORT"
	GinPort        = "GIN_PORT"
	DynamoEndpoint = "DYNAMO_ENDPOINT"
	AccessUrl      = "DYNAMO_ACCESS_KEY_ID"
	AccessPassword = "DYNAMO_SECRET_KEY_ID"
	DynamoRegion   = "DYNAMO_REGION"
	Secret         = "secret"
	Algorithm      = "algorithm"
)

type Config struct {
	DBS       DbInfo
	Port      int
	created   bool
	AWSConfig aws.Config
	JWT       JWTInfo
}

type JWTInfo struct {
	Secret    string
	Algorithm string
}
type DbInfo struct {
	Treatment string
}

func GetConfig() Config {
	if config.created {
		return config
	}
	if err := godotenv.Load(); err != nil {
		log.Errorf("env not found, not panicking but something to check out if not using okteto, %s", err.Error())
	}
	db := DbInfo{
		Treatment: os.Getenv(TreatmentUrl),
	}
	port := os.Getenv(Port)
	portNumber, err := strconv.Atoi(port)
	if ginPort := os.Getenv(GinPort); ginPort != "" { // used only for dev, we should separate this logic in config file
		log.Infof("gin port is: %s", ginPort)
		if ginPortNumber, err := strconv.Atoi(ginPort); err == nil {
			portNumber = ginPortNumber
		}
	}
	jwtInfo := JWTInfo{
		Secret:    os.Getenv(Secret),
		Algorithm: os.Getenv(Algorithm),
	}
	if err := utils.FailIfZeroValue(jwtInfo.Algorithm, jwtInfo.Secret); err != nil {
		log.Errorf("values not found, jwt will not work")
	}
	endpoint := os.Getenv(DynamoEndpoint)
	accountUrl := os.Getenv(AccessUrl)
	accountPassword := os.Getenv(AccessPassword)
	region := os.Getenv(DynamoRegion)
	awsConfig := aws.Config{}
	if endpoint != "" {
		awsConfig.Endpoint = &endpoint
	}
	if region != "" {
		awsConfig.Region = &region
	}
	if err := utils.FailIfZeroValue(accountPassword, accountUrl); err == nil {
		awsConfig.Credentials = credentials.NewStaticCredentials(accountUrl, accountPassword, "")
	}
	log.Infof("Account url is: %s, endpoint is: %s and region is: %s", accountUrl, endpoint, region)
	utils.FailOnError(err)
	config = Config{
		DBS:       db,
		Port:      portNumber,
		created:   true,
		AWSConfig: awsConfig,
		JWT:       jwtInfo,
	}
	return config
}
