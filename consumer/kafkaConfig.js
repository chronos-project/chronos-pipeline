const kafkaConfig = {
  kafkaHost: "kafka-1:29092,kafka-2:29092,kafka-3:29092",
  logger: {
      debug: msg => console.log(msg),
      info: msg => console.log(msg),
      warn: msg => console.log(msg),
      error: msg => console.log(msg)
  },
  groupId: "chronos",
  clientName: "chronos-kafka",
  workerPerPartition: 1,
  options: {
      sessionTimeout: 8000,
      protocol: ["roundrobin"],
      fromOffset: "earliest", //latest
      fetchMaxBytes: 1024 * 100,
      fetchMinBytes: 1,
      fetchMaxWaitMs: 10,
      heartbeatInterval: 250,
      retryMinTimeout: 250,
      autoCommit: false, //if you set this to false and run with backpressure the consumer will commit on every successfull batch
      autoCommitIntervalMs: 1000,
      requireAcks: 0,
      ackTimeoutMs: 100,
      partitionerType: 3,
      encoding: 'utf8',
      keyEncoding: 'utf8'
  }
};

module.exports = kafkaConfig;
