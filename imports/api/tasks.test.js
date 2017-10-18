/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer){
  describe('Tasks', () => {
    const userId = Random.id();
    const otherUserId = Random.id();

    beforeEach(() => {
      // clean the task collection before each test.
      Tasks.remove({});
    });

    describe('methods', () => {
      describe('delete', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        it('user can delete a task that they own', () => {
          //insert test data
          let taskId = Tasks.insert({
            text: 'test task',
            createdAt: new Date(),
            owner: userId,
            username: 'tmeasday'
          });

          // set up a fake method invocation that look like what the method expects
          const invocation = { userId };

          // run the method with `this` set to the fake invocation
          deleteTask.apply(invocation, [taskId]);

          // verify that the method does what we expected
          assert.equal(Tasks.find().count(), 0);
        });

        it('users can delete public tasks that other users own', () => {
          // insert test data
          let taskId = Tasks.insert({
            text: 'test task again bitches',
            createdAt: new Date(),
            owner: otherUserId,
            username: 'tmeasday'
          });

          const invocation = { userId };

          deleteTask.apply(invocation, [taskId]);

          assert.equal(Tasks.find().count(), 0);
        });

        it('throws error when user attempts to delete another users private task', () =>{

          // insert text data
          let taskId = Tasks.insert({
            text: 'another fun test',
            createdAt: new Date(),
            owner: otherUserId,
            username: 'fuckit',
            private: true
          });

          // set up call from the other user!
          const invocation = { userId };

          // run the method with `this` set to the fake invocation
          // assert that you should get an error
          assert.throws(()=>{
            deleteTask.apply(invocation, [taskId]);
          }, Meteor.Error);
        });
      });

      describe('insert',()=>{
        const deleteTask = Meteor.server.method_handlers['tasks.insert'];

        it('user can insert a task',() => {

        });

        it('throws error if user not logged in', () => {

        });
      });
    });
  });
}
