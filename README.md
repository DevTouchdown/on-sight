# OnSight Angular Directive

A simple yet effective way to tell your components when an element has entered or left the screen.

## Use it on your app

Run npm to add the package to your local package.json:

```
  npm i @touchdown/on-sight
```
  
Then, import the **OnSightModule** into your modules:

```
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';

  import { OnSightModule } from '@touchdown/on-sight';

  @NgModule({
    declarations: [ ],
    exports: [ OnSightModule ],
    imports: [ OnSightModule ]
  })
  export class CoreModule { }
```

Finally, use the **onSight** directive in your components!

```
  <div class="tiles-grid">
    <div *ngFor="let item of items; let i = index">
      <app-tile [item]="item" onSight [id]="item.title" [osThreshold]="partial"
        [osContainer]="iframe" (onSight)="onSight($event)" *ngIf="i === 11"></app-tile>
      <app-tile [item]="item" *ngIf="i !== 11"></app-tile>
    </ng-container>
  </div>
```

## Configuration and parameters

The **OnSight** directive has some input and output parameters to make your life easier:

| Parameter | Required | Possible values | Default | Description |
| :---: | :---: | :---: | :---: | :--- |
| id | yes | - | - | Not a directive property, just the html one. |
| [osThreshold] | no | "full", "partial" | "partial" | Determines if the element must be fully visible on screen or just a part of it would do. |
| [osContainer] | no | "standalone", "iframe", "webview" | "standalone" | Tells the directive if your app is placed inside another one and how. |
| [osDeviation] | no | any integer | 1 | Adjusts the pixel accuracy of the element detection by given number. |
| [osAxis] | no | "horizontal, "vertical", "both" | "vertical" | Set the axes tracked by the directive. |
| (onSight) | no | - | - | Link here the function you want to fire when the element is on sight. |
