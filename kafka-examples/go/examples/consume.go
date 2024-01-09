package examples

import (
	"context"
	"log"
	"sync"
	"sync/atomic"

	"github.com/IBM/sarama"
)

func Consume() {
  brokers := []string{"localhost:9092"}
	config := sarama.NewConfig()
	config.Version = KafkaVersion
	config.Consumer.Offsets.Initial = sarama.OffsetOldest

	consumer := Consumer{
		ready:         make(chan struct{}),
		doneChan:      make(chan struct{}),
		totalMessages: int32(totalMesssages),
	}

	client, err := sarama.NewConsumerGroup(brokers, "test-group", config)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithCancel(context.Background())

	wg := &sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			if err := client.Consume(ctx, []string{"test-topic"}, &consumer); err != nil {
				log.Fatalf("Error from consumer: %v\n", err)
			}

			if ctx.Err() != nil {
				return
			}
			consumer.ready = make(chan struct{})
		}
	}()

	<-consumer.ready
	<-consumer.doneChan
	cancel()

	wg.Wait()
	if err = client.Close(); err != nil {
		log.Fatal(err)
	}
}

type Consumer struct {
	ready         chan struct{}
	doneChan      chan struct{}
	totalMessages int32
	received      atomic.Int32
}

// Setup is run at the beginning of a new session, before ConsumeClaim
func (c *Consumer) Setup(sarama.ConsumerGroupSession) error {
	// Mark the consumer as ready
	close(c.ready)
	return nil
}

// Cleanup is run at the end of a session, once all ConsumeClaim goroutines have exited
func (c *Consumer) Cleanup(sarama.ConsumerGroupSession) error {
	return nil
}

// ConsumeClaim must start a consumer loop of ConsumerGroupClaim's Messages().
func (c *Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for c.received.Load() <= c.totalMessages {
		select {
		case message, ok := <-claim.Messages():
			if !ok {
				return nil
			}
			log.Printf("Message claimed: value = %s, timestamp = %v, topic = %s", string(message.Value), message.Timestamp, message.Topic)
			session.MarkMessage(message, "")
			c.received.Add(1)
			if c.received.Load() == c.totalMessages {
				close(c.doneChan)
				log.Printf("received %d messages\n", c.received.Load())
				return nil
			}
		case <-session.Context().Done():
			return nil
		}
	}
	return nil
}
