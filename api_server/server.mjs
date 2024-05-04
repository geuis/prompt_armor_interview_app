import { readFile, writeFile } from 'fs/promises';
import crypto from 'crypto';
import Fastify from "fastify";

const apiServerPort = 3000;
const fastify = Fastify({
  logger: true
});

fastify.addHook('preHandler', (req, reply, done) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET,POST');

  done();
});

// demo in-mem database thingy. would use postgres/etc in a real app.
let database = await readFile('./data/database.json');
database = JSON.parse(database.toString());

const updateDatabase = async () => {
  await writeFile('./data/database.json', JSON.stringify(database, null, 2));
};

const newCode = () => {
  // create a new unique family code
  const uuid = crypto.randomUUID();

  // make it user friendly 
  return `${uuid.slice(0, 4)}-${uuid.slice(4, 8)}`;
};

// create a new family
fastify.post('/api/members', async (request, reply) => {
  let code = '';

  // ensure no existing code
  while (!(code in database.families)) {
    code = newCode();

    database.families[code] = {
      code,
      members: []
    };
  }

  updateDatabase();

  return database.families[code];
});

fastify.get('/api/members/:familyCode', async (request, reply) => {
  if (request.params['familyCode']) {
    const data = database.families[request.params['familyCode']];

    if (data) {
      return data;
    }
  }

  return reply.code(404).send();
});

// add a new member to a family
fastify.post('/api/members/:familyCode', async (request, reply) => {
  try {
    const body = JSON.parse(request.body);
    const memberName = body?.memberName;
    const familyCode = request.params?.familyCode;

    if (familyCode && memberName) {
      const memberObj = {
        id: '',
        name: memberName
      };

      let memberId = '';

      // ensure no existing memberId
      while (!(database.families[familyCode].members.find((m) => m.name === memberName))) {
        memberId = newCode();
        memberObj.id = memberId;

        database.families[familyCode].members.push(memberObj);
      }

      updateDatabase();

      return memberObj;
    }
  } catch (err) {
    throw err;
  }

  return reply.code(404).send();
});

// add new tracked times
fastify.post('/api/times/:userId/:host', async (request, reply) => {
  try {
    const { userId, host } = request.params;
    const times = JSON.parse(request.body);

    if (!database.tracking[userId]) {
      database.tracking[userId] = {};
    }

    if (!database.tracking[userId][host]) {
      database.tracking[userId][host] = [];
    }

    database.tracking[userId][host] = [...database.tracking[userId][host], ...times];

    updateDatabase();

    return reply.send({ ok: 123 });
  } catch (err) {
    throw err;
  }
});

// return time intervals for a userId
fastify.get('/api/times/:userId/:interval', async (request, reply) => {
  try {
    const { userId, interval } = request.params;
    const times = structuredClone(database.tracking[userId]); // have to deep copy this, not leave references
    let cutoffTimestamp = Date.now() - ((interval * 1) * 3600 * 1000);

    for (let host in times) {
      let cutoffIndex = 0;
      const t = times[host];

      for (let i = t.length - 1; i > 0; i--) {
        if (t[i] < cutoffTimestamp) {
          cutoffIndex = i;
          break;
        }
      }

      // sum up total milliseconds for interval
      let total = 0;

      for (let i = cutoffIndex + 1; i < t.length; i++) {
        total += (t[i] - t[i - 1]);
      }

      times[host] = total;
    }

    reply.send(times);
  } catch (err) {
    throw err;
  }
});

try {
  await fastify.listen({ port: apiServerPort });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
