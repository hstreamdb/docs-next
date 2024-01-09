package examples

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/IBM/sarama"
)

func Produce() {
  brokers := []string{"localhost:9092"}
	config := sarama.NewConfig()
	config.Version = KafkaVersion
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Return.Successes = true
	config.Producer.Return.Errors = true

	producer, err := sarama.NewAsyncProducer(brokers, config)
	if err != nil {
		log.Fatal(err)
	}

	totalReceived := 0
	doneChan := make(chan struct{})
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	go func() {
		for {
			select {
			case <-ctx.Done():
				close(doneChan)
				return
			case err := <-producer.Errors():
				log.Printf("produce err: %s\n", err.Error())
			case msg := <-producer.Successes():
				log.Printf("write date to partition %d, offset %d\n", msg.Partition, msg.Offset)
			}
			totalReceived += 1
			if totalReceived >= totalMesssages {
				close(doneChan)
				return
			}
		}
	}()

	for i := 0; i < totalMesssages; i++ {
		msg := &sarama.ProducerMessage{
			Topic: "test-topic",
			Key:   sarama.StringEncoder(fmt.Sprintf("key-%d", i)),
			Value: sarama.StringEncoder(fmt.Sprintf("value-%d", i)),
		}
		select {
		case <-ctx.Done():
		case producer.Input() <- msg:
		}
	}

	<-doneChan
	if err = producer.Close(); err != nil {
		log.Fatal(err)
	}
}
