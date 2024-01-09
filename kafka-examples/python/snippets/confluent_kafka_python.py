# [common]

import os
from confluent_kafka import Producer, Consumer
from confluent_kafka.admin import AdminClient, NewTopic

# NOTE: Replace with your own host and port
host = os.getenv("GUIDE_HOST", "127.0.0.1")
port = os.getenv("GUIDE_PORT", 9092)

topic_name = "my_topic"
group_id = "confluent_kafka_group"

conf = {
    "bootstrap.servers": host + ":" + str(port),
    "client.id": "confluent_kafka_client",
}
# [common]


# [create-topic]
def create_topic():
    admin = AdminClient(conf)
    new_topic = NewTopic(topic_name, num_partitions=1, replication_factor=1)
    admin.create_topics([new_topic])


# [create-topic]


# [produce]
def produce():
    def acked(err, msg):
        if err is not None:
            print(f"Failed to deliver message: {msg}: {err}")
        else:
            print(
                f"Message produced: offset={msg.offset()}, "
                f'key="{msg.key().decode()}", '
                f'value="{msg.value().decode()}"'
            )

    producer = Producer(conf)
    for i in range(5):
        producer.produce(
            topic_name,
            key=b"key " + str(i).encode(),
            value=b"hello, hstream " + str(i).encode(),
            on_delivery=acked,
        )
    producer.flush()


# [produce]


# [consume]
def consume():
    consumer = Consumer(
        {
            **conf,
            "group.id": group_id,
            "auto.offset.reset": "smallest",
            "enable.auto.commit": "false",
            "isolation.level": "read_uncommitted",
        }
    )
    consumer.subscribe([topic_name])
    i = 0
    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                # Initial message consumption may take up to
                # `session.timeout.ms` for the consumer group to
                # rebalance and start consuming
                print("Waiting...")
            elif msg.error():
                print(f"ERROR: {msg.error()}")
            else:
                # Extract the (optional) key and value, and print.
                print(
                    f"Consumed topic {msg.topic()}: "
                    f'key="{msg.key().decode()}", '
                    f'value="{msg.value().decode()}"'
                )
                i += 1
            if i >= 5:
                break
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()


# [consume]


if __name__ == "__main__":
    try:
        create_topic()
        produce()
        consume()
    finally:
        admin = AdminClient(conf)
        admin.delete_topics([topic_name])
