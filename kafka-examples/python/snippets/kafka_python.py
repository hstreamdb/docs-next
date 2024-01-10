# [common]

import os
from kafka.admin import NewTopic
from kafka import KafkaAdminClient, KafkaConsumer, KafkaProducer

# NOTE: Replace with your own host and port
host = os.getenv("GUIDE_HOST", "127.0.0.1")
port = os.getenv("GUIDE_PORT", 9092)
addr = host + ":" + str(port)
topic_name = "my_topic"

# [common]


# [create-topic]
def create_topic():
    admin = KafkaAdminClient(bootstrap_servers=addr)
    topic = NewTopic(name=topic_name, num_partitions=1, replication_factor=1)
    admin.create_topics([topic])


# [create-topic]


# [produce]
def produce():
    producer = KafkaProducer(
        bootstrap_servers=addr,
        acks="all",
        linger_ms=100,
    )
    futures = [
        producer.send(topic_name, b"hello, hstream " + str(i).encode())
        for i in range(5)
    ]
    for future in futures:
        response = future.get(timeout=10)
        print("Producer response:", response)


# [produce]


# [consume]
def consume():
    consumer = KafkaConsumer(
        topic_name,
        bootstrap_servers=addr,
        auto_offset_reset="earliest",
        enable_auto_commit=False,
        fetch_max_wait_ms=1000,
    )
    i = 0
    for msg in consumer:
        print("Consumer response", msg)
        i += 1
        if i >= 5:
            consumer.close()


# [consume]


if __name__ == "__main__":
    try:
        create_topic()
        produce()
        consume()
    finally:
        admin = KafkaAdminClient(bootstrap_servers=addr)
        admin.delete_topics([topic_name])
