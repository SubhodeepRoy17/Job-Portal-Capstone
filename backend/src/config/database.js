const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
      maxIdleTimeMS: 10000 // Close idle connections after 10s
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Atlas Connected: ${connection.connection.host}`);
    console.log(`📊 Database: ${connection.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB Atlas');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });

    // Return the connection for potential reuse
    return connection;

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Detailed error logging for debugging
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB URI format. Please check your MONGODB_URI.');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('Cannot connect to MongoDB Atlas. Possible issues:');
      console.error('1. Check your internet connection');
      console.error('2. Verify MongoDB Atlas cluster is running');
      console.error('3. Check IP whitelist in MongoDB Atlas dashboard');
      console.error('4. Verify database user credentials');
    } else if (error.code === 'ENOTFOUND') {
      console.error('DNS lookup failed. Check your network connection.');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Get database connection status
 */
const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  
  return {
    state: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    port: mongoose.connection.port,
    readyState: mongoose.connection.readyState
  };
};

/**
 * Close database connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed successfully');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

/**
 * Health check function
 */
const checkHealth = async () => {
  try {
    // Simple ping command to check database responsiveness
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  connectDB,
  getDBStatus,
  closeDB,
  checkHealth
};