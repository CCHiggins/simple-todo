import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    //make sure user is logged in before adding a new task!
    if (! Meteor.userId()){
      throw new Meteor.Error('not authorized!');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    //if the task is private and the user isn't the owner
    //then they aren't authorized to delete it!
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId){
          throw new Meteor.Error('not authorized');
    }
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked){
    check(taskId, String);
    check(setChecked, Boolean);

    //if the task is marked private then only the owner
    //can check that mother fucker off.
    const task = Tasks.findOne(taskId)
    if (task.private && task.owner !== this.userId){
      throw new Meteor.Error('not authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setPrivate){
    check(taskId, String);
    check(setPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    if (task.owner !== this.userId) {
      throw new Meteor.Error('not authorized');
    }
    Tasks.update(taskId, { $set: { private: setPrivate } });
  },
});
