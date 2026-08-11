
Feature: Task management

  Scenario: Create a task
    Given the user is on the task list page
    When the user enters a valid title and saves
    Then the task should appear in the list

  Scenario: Edit a task
    Given a task exists
    When the user edits the task title and saves
    Then the updated title should appear in the list

  Scenario: Delete a task
    Given a task exists
    When the user deletes the task
    Then the task should be removed from the list

  Scenario: Search tasks
    Given multiple tasks exist
    When the user searches by keyword
    Then only matching tasks should be shown

  Scenario: Overdue highlighting
    Given a task with a due date in the past exists
    When the task is not Done
    Then the task should be highlighted as overdue
