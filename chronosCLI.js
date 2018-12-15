const exec = require('child_process').exec;
const command = process.argv[2];

switch (command) {
  case 'install-kafka':
    console.log('Setting up Kafka...');
    exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
      setTimeout(() => {
        exec('docker-compose up -d kafka-1').on('close', () => {
          exec('docker-compose up -d kafka-2').on('close', () => {
            exec('docker-compose up -d kafka-3').on('close', () => {

              setTimeout(() => {
                exec('docker exec -i chronos-pipeline_kafka-1_1 kafka-topics --zookeeper zookeeper:2181 --create --topic events --replication-factor 3 --partitions 6 --if-not-exists').on('close', () => {
                  exec('docker-compose stop');
                  console.log('Kafka cluster has been configured!');
                });
              }, 7000)
            });
          });
        });
      }, 7000);
    });
    
    break;

  case 'install-pipeline':
    console.log('Setting up PipelineDB...');
    exec('docker-compose up -d pipeline', (err, stdout, stderr) => {
      setTimeout(() => {
        exec('docker exec -i chronos-pipeline_pipeline_1 psql -U postgres -d chronos_pl < db/setup_pipelinedb.sql').on('close', () => {
          console.log('PipelineDB has been configured!');
        });
      }, 5000)
    })

    break;

  case 'start':
    console.log('Chronos is booting up...');
    exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
      setTimeout(() => exec('docker-compose up').on('close', (err, stdout, stderr) => {
        console.log('Chronos has succesfully booted up!');
      }), 7000);
    });
    break;
  case 'stop':
    console.log('Chronos is shutting down...');
    exec('docker-compose stop', (err, stdout, stderr) => {
      console.log('Chronos has successfully shut down.');
    });
    break;
  case 'status':
    exec('docker ps', (err, stdout, stderr) => console.log(stdout));
  default:
    // TODO: add error and help file
}
