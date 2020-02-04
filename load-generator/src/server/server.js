let express = require("express");
let path = require('path');
let cors = require('cors');
let listenerChildProcessEvents = require('./EventListeners.js')
let app = express();

app.use(express.static('public'))
app.use(cors());

app.get("/execute", (req, res) => {

  console.log("Query String ", req.query);
  //   console.log("Execute given command ", req.query.name);
  //   console.log("Execute given command ", req.query.script);
  //   console.log("Execute given command ", req.query.type);

  const { spawn } = require("child_process");

  let childProcess;
  let pythonExePath = 'python';
  //let pythonExePath = 'C:/Users/MF35121T/Downloads/python381/python';
  let commandExePath = 'C:/Windows/System32/cmd.exe';
  let scriptAbsoultPath = path.join(__dirname, "/scripts/" + req.query.script);

  res.set("Content-Type", "text/plain");

  switch (req.query.type) {

    case 'command':
      console.log(`Given command-task is '${req.query.script}'`);
      childProcess = spawn(req.query.script, { shell: true });
      registerSTDIOStreams(childProcess, res);
      listenerChildProcessEvents(childProcess);
      break;

    case 'python':
      console.log(`Given python-task is '${req.query.script}'`);
      childProcess = spawn(pythonExePath, [scriptAbsoultPath], { shell: true });
      registerSTDIOStreams(childProcess, res);
      listenerChildProcessEvents(childProcess);
      break;

    case 'tomcat':
      console.log(`Given batch-task is '${req.query.script}'`);
      console.log('Bath file path >', req.query.script);
      // childProcess = spawn(commandExePath, ['/c', scriptAbsoultPath], {shell: true });
      childProcess = spawn(req.query.script, {
        shell: true,
        env: {
          CATALINA_HOME: 'C:/KonaKart',
          JAVA_HOME: 'C:/Program Files/Java/jdk1.8.0_221'
        }
      });
      registerSTDIOStreams(childProcess, res);
      listenerChildProcessEvents(childProcess);
      break;

    case 'mysql':
      console.log(`Given batch-task is '${req.query.script}'`);
      console.log('Bath file path >', req.query.script);
      childProcess = spawn(scriptAbsoultPath, {shell: true });      
      registerSTDIOStreams(childProcess, res);
      listenerChildProcessEvents(childProcess);
      break;
    default:
      console.log('Nothing matched ...')
      res.end('This is Default Case and Nothing to executed');
  }
});

const registerSTDIOStreams = (childProcess, res) => {

  childProcess.stdout.pipe(res);
  childProcess.stderr.pipe(res);
  // childProcess.stdout.on('data', data => {
  //     console.log(data.toString())
  // });

}

app.listen(4000, () => console.log("server running on port 4000"));
