---
sidebar_position: 6
sidebar_label: SurrealQL Editors
title: Surrealist | SurrealQL Editors
description: Surrealist is a user interface for interacting with your SurrealDB database visually. It enables you to seamlessly connect to any SurrealDB instance, allowing you to execute queries, explore your tables, design your schemas, and much more.
---

# SurrealQL Editors

Throughout Surrealist you will encounter various SurrealQL editors. These editors support intelligent SurrealQL highlighting and provide a range of features to help you write queries and edit records.

## Shortcuts

Editors support an array of useful shortcuts to help you navigate and edit more efficiently.

<table>
    <thead>
        <tr>
            <th scope="col">Shortcuts</th>
            <th scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td scope="row" data-label="Shortcuts">
                <code>tab</code>
            </td>
            <td scope="row" data-label="Description">
                Indent the current line by 4 spaces.
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>shift + tab</code>
            </td>
            <td scope="row" data-label="Description">
                Unindent the current line by 4 spaces.
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>ctrl/cmd + f</code>
            </td>
            <td scope="row" data-label="Description">
                Open the search and replace panel
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>ctrl/cmd + /</code>
            </td>
            <td scope="row" data-label="Description">
                Toggles comments on the selected or active line(s)
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>ctrl/cmd + left click</code>
            </td>
            <td scope="row" data-label="Description">
                Place multiple cursors at the clicked locations
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>ctrl/cmd + shift + L</code>
            </td>
            <td scope="row" data-label="Description">
                Selects all occurrences of the currently selected text
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>ctrl/cmd + d</code>
            </td>
            <td scope="row" data-label="Description">
                Selects next occurrence of the currently selected text
            </td>
        </tr>
		<tr>
            <td scope="row" data-label="Shortcuts">
                <code>ctrl/cmd + enter</code>
            </td>
            <td scope="row" data-label="Description">
                Execute the query query (only applied to the query editor)
            </td>
        </tr>
	</tbody>
</table>

## Record inspection

Some editors support record inspection, which allows you to open a record in the Record Inspector drawer by holding `ctrl/cmd` and left-clicking on a record id.

## JSON

Some editors, such as the record editor and query responses, support falling back to a JSON representation.
This can be configured in the settings dialog under `Appearance > Value formatting mode`.
