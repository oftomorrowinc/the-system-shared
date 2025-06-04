/* eslint-env node */
/**
 * Firestore Migration Script: Update Task inputSchemaId to inputSchemaIds
 *
 * This script migrates task documents to convert the inputSchemaId string field
 * to an inputSchemaIds array field.
 *
 * Before: task.inputSchemaId = "schema123"
 * After:  task.inputSchemaIds = ["schema123"]
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
  // Add your Firebase config here
});

const db = admin.firestore();

async function migrateTaskInputSchemaIds() {
  console.log('Starting task inputSchemaId to inputSchemaIds migration...');

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

      // Check if inputSchemaId exists (needs migration)
      if (data.inputSchemaId && typeof data.inputSchemaId === 'string') {
        console.log(
          `Migrating task ${doc.id}: inputSchemaId "${data.inputSchemaId}" -> inputSchemaIds ["${data.inputSchemaId}"]`
        );

        // Create update object
        const updateData = {
          inputSchemaIds: [data.inputSchemaId],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Remove the old field
        updateData.inputSchemaId = admin.firestore.FieldValue.delete();

        batch.update(doc.ref, updateData);

        processedCount++;
        batchCount++;

        // Commit batch when it reaches the size limit
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`Committed batch of ${batchCount} updates`);
          batchCount = 0;
        }
      } else if (data.inputSchemaIds && Array.isArray(data.inputSchemaIds)) {
        console.log(`Task ${doc.id} already has inputSchemaIds array:`, data.inputSchemaIds);
      } else if (data.inputSchemaId) {
        console.log(`Task ${doc.id} has unexpected inputSchemaId format:`, data.inputSchemaId);
      } else {
        console.log(`Task ${doc.id} has no inputSchemaId field`);
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
migrateTaskInputSchemaIds()
  .then(() => {
    console.log('Task inputSchemaIds migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Task inputSchemaIds migration failed:', error);
    process.exit(1);
  });
