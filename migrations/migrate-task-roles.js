/* eslint-env node */
/**
 * Firestore Migration Script: Update Task Role References
 *
 * This script migrates task documents to replace role object references
 * with role.name string values.
 *
 * Before: task.role = { id: "role123", name: "Developer" }
 * After:  task.role = "Developer"
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
  // Add your Firebase config here
});

const db = admin.firestore();

async function migrateTaskRoles() {
  console.log('Starting task role migration...');

  const batch = db.batch();
  let processedCount = 0;
  let batchCount = 0;
  const BATCH_SIZE = 500;

  try {
    // Get all task documents
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef.get();

    console.log(`Found ${snapshot.size} task documents to process`);

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Check if role is an object (needs migration)
      if (data.role && typeof data.role === 'object' && data.role.name) {
        console.log(`Migrating task ${doc.id}: ${JSON.stringify(data.role)} -> ${data.role.name}`);

        // Update the role field to be just the role name
        batch.update(doc.ref, {
          role: data.role.name,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        processedCount++;
        batchCount++;

        // Commit batch when it reaches the size limit
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`Committed batch of ${batchCount} updates`);
          batchCount = 0;
        }
      } else if (typeof data.role === 'string') {
        console.log(`Task ${doc.id} already has string role: ${data.role}`);
      } else {
        console.log(`Task ${doc.id} has unexpected role format:`, data.role);
      }
    }

    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }

    console.log(`Migration completed successfully!`);
    console.log(`Total tasks processed: ${processedCount}`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateTaskRoles()
  .then(() => {
    console.log('Task role migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Task role migration failed:', error);
    process.exit(1);
  });
