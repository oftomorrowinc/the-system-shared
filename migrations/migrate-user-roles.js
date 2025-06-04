/* eslint-env node */
/* eslint-disable no-prototype-builtins */
/**
 * Firestore Migration Script: Remove availableRoles and preferredRoles from Users
 *
 * This script migrates user documents to remove the availableRoles and
 * preferredRoles fields that are no longer needed.
 *
 * Before: user.availableRoles = ["role1", "role2"], user.preferredRoles = ["role1"]
 * After:  Fields completely removed from user documents
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
  // Add your Firebase config here
});

const db = admin.firestore();

async function migrateUserRoles() {
  console.log('Starting user availableRoles and preferredRoles removal migration...');

  const batch = db.batch();
  let processedCount = 0;
  let batchCount = 0;
  const BATCH_SIZE = 500;

  try {
    // Get all user documents
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    console.log(`Found ${snapshot.size} user documents to process`);

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Check if either field exists (needs migration)
      const hasAvailableRoles = Object.prototype.hasOwnProperty.call(data, 'availableRoles');
      const hasPreferredRoles = Object.prototype.hasOwnProperty.call(data, 'preferredRoles');

      if (hasAvailableRoles || hasPreferredRoles) {
        console.log(`Migrating user ${doc.id}: removing availableRoles and preferredRoles fields`);

        // Create update object to remove fields
        const updateData = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (hasAvailableRoles) {
          updateData.availableRoles = admin.firestore.FieldValue.delete();
        }

        if (hasPreferredRoles) {
          updateData.preferredRoles = admin.firestore.FieldValue.delete();
        }

        batch.update(doc.ref, updateData);

        processedCount++;
        batchCount++;

        // Commit batch when it reaches the size limit
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`Committed batch of ${batchCount} updates`);
          batchCount = 0;
        }
      } else {
        console.log(`User ${doc.id} already migrated (no role fields found)`);
      }
    }

    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }

    console.log(`Migration completed successfully!`);
    console.log(`Total users processed: ${processedCount}`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateUserRoles()
  .then(() => {
    console.log('User roles migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('User roles migration failed:', error);
    process.exit(1);
  });
