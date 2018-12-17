const exec = require('child_process').exec;
const command = process.argv[2];
const log = (msg) => {
  console.log(`>> ${msg}`);
};

switch (command) {
  case 'install-kafka':
    log('Setting up Kafka...');
    exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
      log('Starting Zookeeper...');
      setTimeout(() => {
        log('Starting Kafka Brokers...');
        exec('docker-compose up -d kafka-1').on('close', () => {
          log('Kafka Broker 1 running');
          exec('docker-compose up -d kafka-2').on('close', () => {
            log('Kafka Broker 2 running');
            exec('docker-compose up -d kafka-3').on('close', () => {
              log('Kafka Broker 3 running');

              setTimeout(() => {
                log("Setting up 'events' topic...")
                exec('docker exec -i chronos-pipeline_kafka-1_1 kafka-topics --zookeeper zookeeper:2181 --create --topic events --replication-factor 3 --partitions 6 --if-not-exists').on('close', () => {
                  log('Topic created')
                  exec('docker-compose stop');
                  log('Stopping Zookeeper and Kafka Brokers...')
                });
              }, 7000);
            });
          });
        });
        log('Kafka cluster has been configured!');
      }, 7000);
    });

    break;

  case 'install-pipeline':
    log('Setting up PipelineDB...');
    exec('docker-compose up -d pipeline', (err, stdout, stderr) => {
      setTimeout(() => {
        exec('docker exec -i chronos-pipeline_pipeline_1 psql -U postgres -d chronos_pl < db/setup_pipelinedb.sql').on('close', () => {
          log('PipelineDB has been configured!');
        });
      }, 5000)
    })

    break;

  case 'start':
    log('Chronos is booting up...');
    exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
      setTimeout(() => exec('docker-compose up').on('close', (err, stdout, stderr) => {
        log('Chronos has succesfully booted up!');
      }), 7000);
    });
    break;
  case 'stop':
    log('Chronos is shutting down...');
    exec('docker-compose stop', (err, stdout, stderr) => {
      log('Chronos has successfully shut down.');
    });
    break;
  case 'status':
    exec('docker ps', (err, stdout, stderr) => console.log(stdout));
  default:
    // TODO: add error and help file
}
