Meteor.startup(function () {
  if (Meteor.users.find().count() == 0) {
    Accounts.createUser({
      email: 'test@test.com',
      password: 'testtest',
      profile: {
        character: 'tester',
        displayName: 'Chad Darling',
        admin: true
      }
    });

    Accounts.createUser({
      email: 'test2@test.com',
      password: 'testtest2',
      profile: {
        character: 'tester2',
        displayName: 'Lewis Carroll'
      }
    });

    Accounts.createUser({
      email: 'test3@test.com',
      password: 'testtest3',
      profile: {
        character: 'tester3',
        displayName: 'Hayao Miyazaki'
      }
    });
  }
});
