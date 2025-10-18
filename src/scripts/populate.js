import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Route, Bus, Trip, User } from '../models/index.js';

dotenv.config();

const seedData = {
  "routes": [
    {
      "code": "CK",
      "name": "Colombo to Kandy",
      "origin": "Colombo",
      "destination": "Kandy",
      "stops": [
        {"name": "Colombo", "lat": 6.9271, "lng": 79.8612},
        {"name": "Kadawatha", "lat": 7.0017, "lng": 79.9497},
        {"name": "Gampaha", "lat": 7.0914, "lng": 80.0103},
        {"name": "Kegalle", "lat": 7.2529, "lng": 80.3464},
        {"name": "Peradeniya", "lat": 7.2706, "lng": 80.5938},
        {"name": "Kandy", "lat": 7.2906, "lng": 80.6337}
      ],
      "distanceKm": 115,
      "estimatedDurationMin": 180
    },
    {
      "code": "CJ",
      "name": "Colombo to Jaffna",
      "origin": "Colombo",
      "destination": "Jaffna",
      "stops": [
        {"name": "Colombo", "lat": 6.9271, "lng": 79.8612},
        {"name": "Kurunegala", "lat": 7.4863, "lng": 80.3647},
        {"name": "Anuradhapura", "lat": 8.3114, "lng": 80.4037},
        {"name": "Vavuniya", "lat": 8.7542, "lng": 80.4982},
        {"name": "Jaffna", "lat": 9.6615, "lng": 80.0255}
      ],
      "distanceKm": 325,
      "estimatedDurationMin": 480
    },
    {
      "code": "CG",
      "name": "Colombo to Galle",
      "origin": "Colombo",
      "destination": "Galle",
      "stops": [
        {"name": "Colombo", "lat": 6.9271, "lng": 79.8612},
        {"name": "Kalutara", "lat": 6.5831, "lng": 79.9610},
        {"name": "Ambalangoda", "lat": 6.2358, "lng": 80.0538},
        {"name": "Hikkaduwa", "lat": 6.1418, "lng": 80.1003},
        {"name": "Galle", "lat": 6.0535, "lng": 80.2210}
      ],
      "distanceKm": 119,
      "estimatedDurationMin": 150
    },
    {
      "code": "KA",
      "name": "Kandy to Arugam Bay",
      "origin": "Kandy",
      "destination": "Arugam Bay",
      "stops": [
        {"name": "Kandy", "lat": 7.2906, "lng": 80.6337},
        {"name": "Mahiyangana", "lat": 7.3219, "lng": 81.0101},
        {"name": "Monaragala", "lat": 6.8728, "lng": 81.3510},
        {"name": "Pottuvil", "lat": 6.8700, "lng": 81.8400},
        {"name": "Arugam Bay", "lat": 6.8422, "lng": 81.8364}
      ],
      "distanceKm": 195,
      "estimatedDurationMin": 300
    },
    {
      "code": "GM",
      "name": "Galle to Matara",
      "origin": "Galle",
      "destination": "Matara",
      "stops": [
        {"name": "Galle", "lat": 6.0535, "lng": 80.2210},
        {"name": "Unawatuna", "lat": 6.0174, "lng": 80.2488},
        {"name": "Weligama", "lat": 5.9750, "lng": 80.4297},
        {"name": "Matara", "lat": 5.9549, "lng": 80.5550}
      ],
      "distanceKm": 42,
      "estimatedDurationMin": 60
    }
  ],
  "buses": [
    // Route CK - Colombo to Kandy (5 buses)
    {"busId": "B001", "registrationNo": "SLTB-CK-001", "operatorName": "Sri Lanka Transport Board", "capacity": 50, "routeCode": "CK"},
    {"busId": "B002", "registrationNo": "SLTB-CK-002", "operatorName": "Sri Lanka Transport Board", "capacity": 50, "routeCode": "CK"},
    {"busId": "B003", "registrationNo": "SLTB-CK-003", "operatorName": "Sri Lanka Transport Board", "capacity": 50, "routeCode": "CK"},
    {"busId": "B004", "registrationNo": "SLTB-CK-004", "operatorName": "Sri Lanka Transport Board", "capacity": 50, "routeCode": "CK"},
    {"busId": "B005", "registrationNo": "SLTB-CK-005", "operatorName": "Sri Lanka Transport Board", "capacity": 50, "routeCode": "CK"},
    
    // Route CJ - Colombo to Jaffna (5 buses)
    {"busId": "B006", "registrationNo": "PVT-CJ-001", "operatorName": "North Express", "capacity": 45, "routeCode": "CJ"},
    {"busId": "B007", "registrationNo": "PVT-CJ-002", "operatorName": "North Express", "capacity": 45, "routeCode": "CJ"},
    {"busId": "B008", "registrationNo": "PVT-CJ-003", "operatorName": "North Express", "capacity": 45, "routeCode": "CJ"},
    {"busId": "B009", "registrationNo": "PVT-CJ-004", "operatorName": "North Express", "capacity": 45, "routeCode": "CJ"},
    {"busId": "B010", "registrationNo": "PVT-CJ-005", "operatorName": "North Express", "capacity": 45, "routeCode": "CJ"},
    
    // Route CG - Colombo to Galle (5 buses)
    {"busId": "B011", "registrationNo": "SLTB-CG-001", "operatorName": "Sri Lanka Transport Board", "capacity": 52, "routeCode": "CG"},
    {"busId": "B012", "registrationNo": "SLTB-CG-002", "operatorName": "Sri Lanka Transport Board", "capacity": 52, "routeCode": "CG"},
    {"busId": "B013", "registrationNo": "SLTB-CG-003", "operatorName": "Sri Lanka Transport Board", "capacity": 52, "routeCode": "CG"},
    {"busId": "B014", "registrationNo": "SLTB-CG-004", "operatorName": "Sri Lanka Transport Board", "capacity": 52, "routeCode": "CG"},
    {"busId": "B015", "registrationNo": "SLTB-CG-005", "operatorName": "Sri Lanka Transport Board", "capacity": 52, "routeCode": "CG"},
    
    // Route KA - Kandy to Arugam Bay (5 buses)
    {"busId": "B016", "registrationNo": "PVT-KA-001", "operatorName": "East Coast Express", "capacity": 40, "routeCode": "KA"},
    {"busId": "B017", "registrationNo": "PVT-KA-002", "operatorName": "East Coast Express", "capacity": 40, "routeCode": "KA"},
    {"busId": "B018", "registrationNo": "PVT-KA-003", "operatorName": "East Coast Express", "capacity": 40, "routeCode": "KA"},
    {"busId": "B019", "registrationNo": "PVT-KA-004", "operatorName": "East Coast Express", "capacity": 40, "routeCode": "KA"},
    {"busId": "B020", "registrationNo": "PVT-KA-005", "operatorName": "East Coast Express", "capacity": 40, "routeCode": "KA"},
    
    // Route GM - Galle to Matara (5 buses)
    {"busId": "B021", "registrationNo": "SLTB-GM-001", "operatorName": "Southern Transport", "capacity": 48, "routeCode": "GM"},
    {"busId": "B022", "registrationNo": "SLTB-GM-002", "operatorName": "Southern Transport", "capacity": 48, "routeCode": "GM"},
    {"busId": "B023", "registrationNo": "SLTB-GM-003", "operatorName": "Southern Transport", "capacity": 48, "routeCode": "GM"},
    {"busId": "B024", "registrationNo": "SLTB-GM-004", "operatorName": "Southern Transport", "capacity": 48, "routeCode": "GM"},
    {"busId": "B025", "registrationNo": "SLTB-GM-005", "operatorName": "Southern Transport", "capacity": 48, "routeCode": "GM"}
  ],
  "trips": [
    // Sample trips for route CK
    {"tripId": "T001", "routeCode": "CK", "busId": "B001", "departureTime": "2025-10-12T06:00:00Z", "arrivalTime": "2025-10-12T09:00:00Z", "date": "2025-10-12"},
    {"tripId": "T002", "routeCode": "CK", "busId": "B001", "departureTime": "2025-10-12T14:00:00Z", "arrivalTime": "2025-10-12T17:00:00Z", "date": "2025-10-12"},
    {"tripId": "T003", "routeCode": "CK", "busId": "B002", "departureTime": "2025-10-12T08:00:00Z", "arrivalTime": "2025-10-12T11:00:00Z", "date": "2025-10-12"},
    
    // Sample trips for route CJ
    {"tripId": "T004", "routeCode": "CJ", "busId": "B006", "departureTime": "2025-10-12T05:00:00Z", "arrivalTime": "2025-10-12T13:00:00Z", "date": "2025-10-12"},
    {"tripId": "T005", "routeCode": "CJ", "busId": "B007", "departureTime": "2025-10-12T07:00:00Z", "arrivalTime": "2025-10-12T15:00:00Z", "date": "2025-10-12"}
  ]
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🚀 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Trip.destroy({ where: {} });
    await Bus.destroy({ where: {} });
    await Route.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create users
    console.log('👤 Creating users...');
    const hashedOperator = await bcrypt.hash('operator123', 10);
    const hashedCommuter = await bcrypt.hash('commuter123', 10);
    await User.bulkCreate([
      { username: 'operator', password: hashedOperator, role: 'bus_operator' },
      { username: 'commuter', password: hashedCommuter, role: 'commuter' },
    ]);

    // Create routes
    console.log('🛣️  Creating routes...');
    const routeMap = {};
    for (const routeData of seedData.routes) {
      const route = await Route.create(routeData);
      routeMap[routeData.code] = route.id;
      console.log(`   ✅ Route ${routeData.code}: ${routeData.name}`);
    }

    // Create buses
    console.log('🚌 Creating buses...');
    const busMap = {};
    for (const busData of seedData.buses) {
      const bus = await Bus.create({
        busId: busData.busId,
        registrationNo: busData.registrationNo,
        operatorName: busData.operatorName,
        capacity: busData.capacity,
        routeId: routeMap[busData.routeCode],
        status: 'idle'
      });
      busMap[busData.busId] = bus.id;
      console.log(`   ✅ Bus ${busData.busId} on route ${busData.routeCode}`);
    }

    // Create trips
    console.log('🎫 Creating trips...');
    for (const tripData of seedData.trips) {
      await Trip.create({
        tripId: tripData.tripId,
        routeId: routeMap[tripData.routeCode],
        busId: busMap[tripData.busId],
        departureTime: tripData.departureTime,
        arrivalTime: tripData.arrivalTime,
        date: tripData.date
      });
      console.log(`   ✅ Trip ${tripData.tripId}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:
    - 5 Routes created
    - 25 Buses created (5 per route)
    - ${seedData.trips.length} Sample trips created
    - 2 Users created (operator, commuter)`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run the seeding if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;