/* eslint-env node */
/* eslint-disable no-prototype-builtins */
/**
 * Firestore Migration Script: Remove role fields from Projects and Workflows
 *
 * This script migrates project and workflow documents to remove role-related fields:
 * - Remove 'roles' field from project member objects
 * - Remove 'requiredRoles' field from workflow documents
 *
 * Before:
 *   project.members[userId].roles = ["role1", "role2"]
 *   workflow.requiredRoles = ["role1", "role2"]
 * After:
 *   Fields completely removed
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
  // Add your Firebase config here
});

const db = admin.firestore();

async function migrateProjectMemberRoles() {
  console.log('Starting project member roles removal migration...');

  const batch = db.batch();
  let processedCount = 0;
  let batchCount = 0;
  const BATCH_SIZE = 500;

  try {
    // Get all project documents
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.get();

    console.log(`Found ${snapshot.size} project documents to process`);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let needsUpdate = false;

      // Check if members object exists and has roles fields
      if (data.members && typeof data.members === 'object') {
        const updatedMembers = { ...data.members };

        for (const [userId, member] of Object.entries(data.members)) {
          if (
            member &&
            typeof member === 'object' &&
            Object.prototype.hasOwnProperty.call(member, 'roles')
          ) {
            console.log(`Removing roles from project ${doc.id}, member ${userId}`);
            delete updatedMembers[userId].roles;
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          batch.update(doc.ref, {
            members: updatedMembers,
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
        }
      }
    }

    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }

    console.log(`Project member roles migration completed!`);
    console.log(`Total projects processed: ${processedCount}`);
  } catch (error) {
    console.error('Project member roles migration failed:', error);
    throw error;
  }
}

async function migrateWorkflowRequiredRoles() {
  console.log('Starting workflow requiredRoles removal migration...');

  const batch = db.batch();
  let processedCount = 0;
  let batchCount = 0;
  const BATCH_SIZE = 500;

  try {
    // Get all workflow documents
    const workflowsRef = db.collection('workflows');
    const snapshot = await workflowsRef.get();

    console.log(`Found ${snapshot.size} workflow documents to process`);

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Check if requiredRoles field exists
      if (Object.prototype.hasOwnProperty.call(data, 'requiredRoles')) {
        console.log(`Removing requiredRoles from workflow ${doc.id}`);

        batch.update(doc.ref, {
          requiredRoles: admin.firestore.FieldValue.delete(),
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
      } else {
        console.log(`Workflow ${doc.id} already migrated (no requiredRoles field)`);
      }
    }

    // Commit any remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} updates`);
    }

    console.log(`Workflow requiredRoles migration completed!`);
    console.log(`Total workflows processed: ${processedCount}`);
  } catch (error) {
    console.error('Workflow requiredRoles migration failed:', error);
    throw error;
  }
}

// Run both migrations
async function runMigrations() {
  try {
    await migrateProjectMemberRoles();
    await migrateWorkflowRequiredRoles();
    console.log('All role field migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
