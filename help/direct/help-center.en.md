# LaunchMe Help Center

Documentation updated: 2026-11-04. Website version. Supports macOS 26 and macOS 27.

- [Full screen launcher](full-screen-launcher.en.md)
- [Notch](notch.en.md)
- [Dock](dock.en.md)
- [Music](music.en.md)

## Full screen launcher

### Getting started

Install LaunchMe on macOS 26 or macOS 27 and open your first launcher view. This guide covers the website download, initial setup, and the choice between Classic view and Categories.

#### System requirements

LaunchMe currently supports **macOS 26 and macOS 27**. These guides cover the version downloaded from the LaunchMe website.

#### Install LaunchMe

1. Download LaunchMe from the [LaunchMe website](/).
2. Open the downloaded **.dmg** file.
3. Drag **LaunchMe** into your **Applications** folder.
4. Open **Applications** and double-click **LaunchMe**. If macOS asks you to confirm opening an app downloaded from the internet, choose **Open**.
5. Once LaunchMe is installed, eject the disk image in Finder.

#### First launch

Start with the full-screen launcher, then enable **Notch** or **Dock** in **Settings → General** when you want to use them. Grant permissions when prompted for a feature you choose to use.

If you already have a paid plan, open **Settings → General → Account** and sign in with the account used for your purchase. Use **Refresh License** if your plan does not appear.

#### Open the launcher

Open LaunchMe from the menu bar, click its Dock icon, or press **⌘4**. Click an app to launch it, or use search to find it by name.

The menu in the upper-right corner opens the launcher tools. From here you can add folders and widgets, change the background, sort apps, browse themes, and open **Settings**.

#### Classic view and Categories

Open **Settings → General → Classic view** to choose your home view.

- **On:** an editable app grid with pages, folders, and widgets.
- **Off:** a page of category cards for browsing apps by type.

Grid tools such as **Create folder**, **Sort**, and **Add widget** appear in Classic view. If these buttons are missing, check this setting first.

#### Showing and hiding the launcher

The menu bar's **Show / Hide** command and your keyboard shortcut toggle the launcher. Opening an app normally dismisses it. **Always On** changes this behavior; see [Window behavior](#window-behavior).

**Hide** closes the launcher view while LaunchMe keeps running. **Quit LaunchMe** stops the app, including its Dock and notch features.

### Shortcuts and gestures

Choose how to open and hide the full-screen launcher: a keyboard shortcut, a trackpad pinch, or a hot corner. Hot corners require Accessibility permission.

#### Keyboard shortcut

Open **Settings → General → Hot Key** and click **Change**. Press your new key combination, check the captured keys, then click **Save**. **Cancel** leaves the previous shortcut in place.

Use **Disable** to stop the shortcut from invoking LaunchMe without choosing a replacement. **Enable** turns it back on. The default is **⌘4**.

Choose a combination that is not already used by another app or macOS.

#### Pinch to invoke

Open **Settings → General → Pinch to invoke**. Enable the gesture and choose the number of fingers. Pinch those fingers together on the trackpad to show or hide LaunchMe.

If macOS handles the same gesture, follow the setup guidance in the app and disable the conflicting system gesture. macOS may need a restart before that change takes effect.

#### Hot corners invoke

In **Settings → General → Hot corners invoke**, enable **Top Left**, **Top Right**, **Bottom Left**, or **Bottom Right**. Moving the pointer into an enabled corner invokes LaunchMe.

This feature needs **Accessibility** permission. Use **Open Settings** if prompted, enable LaunchMe under **System Settings → Privacy & Security → Accessibility**, then restart LaunchMe. **Recheck** checks the permission again.

### Apps and layout

Organize the apps in your launcher and choose how their names and icons appear. Moving or hiding an item changes your LaunchMe setup; deleting an app from your Mac is a separate action.

#### Moving apps

In Classic view, drag an app to another grid position. Arrange folders, workflows, and widgets alongside your apps. Widgets use several cells, so their size affects where other items can fit.

Use the page controls to move between pages. Your arrangement is saved as you work.

#### Select several apps

Hold **Shift** and click app icons in the main grid to select them. Right-click the selection for **New folder with selected**, **Add to Dock**, **Add to Notch**, **Open**, or **Hide app**. Shift-click a selected app to remove it from the selection.

Batch actions apply to selected apps on the current page. Hiding still requires Lite or Pro, and notch placement requires access to the notch.

#### App names

Right-click an app and choose **Rename**. Type the label you want to use in LaunchMe and confirm it. **Restore original name** removes your custom label.

The change applies to the name shown in LaunchMe. The app's name and location in Finder stay the same. Alphabetical sorting uses the displayed name.

#### App icons

Right-click an app and choose **Customize icon**, then select an image. Choose **Reset icon** to remove the custom image.

A custom PNG can also expose **Clear / on** and **Clear / off**. These change the background treatment of that custom icon.

Custom icons require **Pro**. They change the icon in LaunchMe rather than editing the application bundle.

#### Hiding apps

Choose **Hide app** from an app's context menu to remove it from the main launcher. It stays installed on your Mac.

To bring it back, open **Categories → Hidden**, right-click the app, and choose **Unhide app**. Hiding and unhiding require **Lite or Pro**.

#### Additional app sources

Open **Settings → Apps → Additional app sources** and add a folder containing applications. LaunchMe includes apps from that folder in its app catalog.

Remove a folder from the list to stop using it as an additional source. This does not delete the folder or its apps. If an app is missing, check its installation location and whether it was hidden in the current Space.

#### Delete from Mac

Right-click an eligible app and choose **Delete from Mac**. The confirmation shows the app and related items LaunchMe found, including their combined size. Confirm to move those items to the Trash.

The action can include caches, preferences, and other related files. Review the confirmation before proceeding. Items can be recovered from the Trash until it is emptied.

Protected system apps and LaunchMe itself do not offer this action. Use **Hide app** if you only want to remove an icon from your launcher.

### Folders

Group apps in LaunchMe folders, edit their contents, and customize the open-folder grid. Finder-folder shortcuts link to real folders on your Mac and work differently from app groups.

#### Creating a folder

Open the launcher tools and choose **Create folder**. Give the folder a name, select its apps, and save it. Click the folder icon to open its contents.

A LaunchMe folder groups launcher items; it is different from a folder of files in Finder.

#### Editing a folder

Right-click a folder and choose **Edit**. Change its name or contents, then save. Inside a folder, **Remove from Folder** takes an app out of that group without uninstalling it.

Use **Delete Folder** to remove the group. Its apps remain installed.

#### Folder grid and sorting

Right-click inside an open folder and choose **Folder apps grid**. Pick a layout from **3×5** through **5×8**; the first number is rows and the second is columns. The default is **3×5**. This is the shared open-folder grid preference.

Choose **Sort A–Z** from the same menu to sort that folder's contents by name. This sorts the open folder rather than the entire launcher.

#### Folder appearance

Use the folder editor's icon controls to change its appearance. The available choices include image, symbol, and emoji options, with background controls for supported styles. Folder appearance customization requires **Pro**.

The material behind an opened folder is controlled separately in **Settings → Appearance → Folder Panel Background**.

#### Finder folders

A Finder-folder shortcut points to a real location on your Mac. Opening it gives you access to that folder's files. Its contents and permissions come from macOS, rather than the app selection in a LaunchMe folder.

You can also add Finder folders to the [Dock](dock.en.md#finder-folders) for quick access.

### Categories

Browse your apps by category and choose which groups appear on the categories page. You can make this page your starting view and use Hidden to restore hidden apps.

Open **Settings → Apps** to configure the categories page.

**Show categories page** makes it available alongside your grid. **Show as main page on launch** opens it first when you invoke LaunchMe. The category selection controls choose which app groups appear.

The page also includes **Recently opened**, **Other**, and **Hidden** groups. Open a card to browse its apps. The Hidden group is where you can restore apps removed with **Hide app**.

### Sorting and saved layouts

Sort your launcher, group apps automatically, or try restoring a previous macOS Launchpad arrangement. Save your current layout before replacing an organization you want to keep.

#### Sort A-Z

Open the launcher tools' sort menu and choose **Sort A-Z** to arrange apps and folders alphabetically by their displayed names. You can also use **Settings → Apps → Sort Layout**.

If you have an arrangement you want to return to, save it before sorting.

#### Auto group

Choose **Auto group** from the sort menu. LaunchMe groups recognized apps into folders using its built-in app groupings.

Check the resulting layout in the confirmation view. Keep the change if it suits you, or undo it to return to the previous arrangement. Unrecognized apps are not guaranteed to be assigned to a group.

#### Restore Launchpad layout

Choose **Restore Launchpad layout** from the sort menu to try importing your previous macOS Launchpad pages and folders. LaunchMe matches entries from the old database to apps currently installed on your Mac.

Review the result and choose whether to keep it. If a usable old Launchpad database is not available, the app shows the reason it cannot restore the layout. This action restores an arrangement inside LaunchMe; it does not reinstall Apple's Launchpad.

#### Save Layout

Open **Settings → Apps → Save Layout** to save an arrangement. Use **Saved Layouts** to apply it later or delete the saved entry.

A saved layout is for restoring an app arrangement. Use a **Space** when you also want a separate wallpaper, widget setup, and other supported settings.

#### Reset Layout

Use **Settings → Apps → Reset Layout** to reset the arrangement, folders, and hidden-app choices. Read the confirmation before accepting it.

Resetting the layout does not uninstall applications. It does remove launcher organization, so save a layout first if you want to keep it.

### Search

Find apps, search for files, copy emoji, and calculate answers from the launcher search field. File search relies on macOS indexing and may need access to protected folders.

#### Search modes

Use the buttons by the search field to choose **Apps**, **Files**, **Clipboard**, or **Emoji**. Press **Tab** while using search to cycle through these modes.

In Classic view, **Settings → General → Search location** places the search control in the center or on the right.

#### Apps

Type an app name. Use the arrow keys to select a result, then press **Return**, or click the result to launch it.

Custom display names are shown in the launcher, so use names that will be easy for you to recognize later.

#### Files

Select **Files** and search by file name. Click a result to reveal it in Finder. Right-click it for more actions:

- **Show in Finder:** select the file in its folder.
- **Quick Look:** preview the file.
- **Copy File:** copy the file to the clipboard.
- **Copy Name / Copy Path:** copy its name or full location as text.
- **Add to Dock:** pin an application or Finder folder from the results. This action is offered for apps and folders, not ordinary files.
- **Move to Trash:** move the actual file to the Trash.

Search depends on macOS indexing. Access to protected folders may be needed for thumbnails, previews, and file operations. If you cannot find a file, check that macOS search can find it too.

#### Calculator

Type an expression such as `24 * 3`, `(120 + 80) / 4`, or `200 * 15%`. The result appears beneath search. Click the result card to copy the answer.

The calculator supports addition, subtraction, multiplication, division, percentages, and parentheses. It is intended for quick calculations rather than a scientific calculator's functions.

#### Emoji and symbols

Select **Emoji** to search or browse characters. Choose a category, select an item, and use **Copy to Clipboard**. Arrow keys move the selection; **Return** copies it.

Use Favorites for characters you return to often. Paste the copied character into the app where you need it.

### Clipboard

Find and copy earlier clipboard items from the full-screen launcher. The history is shared with Notch, while files and screenshots need access to their containing folders.

#### Copying an earlier item

Select **Clipboard** in search to browse your clipboard history. Search for an item, click **Copy**, then paste it into your destination app. You can also use the arrow keys and **Return** to copy a selected item.

The same history is accessible from the notch.

#### Categories and Favorites

Clipboard has **Recent**, **Images**, **Colors**, **Text**, **Links**, **Files**, **Favorites**, and **Screenshots** categories. These filter the history rather than creating separate clipboards.

In the notch's card view, the star saves an item to Favorites, the copy button copies it again, and the trash button removes its history entry. Removing a history entry does not delete the original file from your Mac.

**Clear all** requires a second click to confirm. Copy anything you still need before clearing history.

#### File permissions

Text, links, and copied images do not require access to Desktop or Documents. A copied file does: LaunchMe needs permission to read the folder containing it before it can preview or copy the file again.

Use **Grant Access to Specific Folders** or the access button on the item. In your home folder, select **Desktop**, **Documents**, and **Downloads** as needed. Hold **⌘** to select more than one.

These folder permissions are separate from Full Disk Access used by other features.

#### Screenshots

New screenshots taken with **⇧⌘3** or **⇧⌘4** can appear in **Clipboard → Screenshots** after macOS saves them.

Use **Choose Screenshot Folder…** to select their save location. Desktop is the usual default, but choose your actual destination if you changed it in macOS. LaunchMe needs access to that folder to read the screenshot files.

### Appearance

Customize the full-screen launcher with themes, backgrounds, glass materials, and icon labels. Requirements vary by setting; the sections below identify paid and macOS-specific options.

#### Light, Dark, and System

Open **Settings → Appearance → Theme**. **Light** and **Dark** keep a fixed appearance. **System** follows your Mac.

Choose **Title color → Auto, Dark, or Light** separately if the text below icons needs a different color against your wallpaper.

#### Wallpaper and blur

Open the launcher tools and choose **Appearance → Change background** to pick a custom wallpaper. **Blur on / Blur off** changes its blur treatment; the control becomes available after a custom background is selected.

**Reset to default** removes the custom background and returns to the default blurred appearance. Custom backgrounds require **Pro**.

#### Liquid Glass

On macOS 26 or later, open **Settings → Appearance → Liquid Glass**. Choose **Liquid Glass** or **Standard** to change the launcher materials. Turning Liquid Glass on or off is free.

**Glass Settings** requires **Lite or Pro**:

- **Tinted:** adds a tint to glass surfaces. Use the color slider for a custom hue, or **Standard** for the default tint.
- **Clear:** uses a clearer glass treatment.

On macOS 27 or later, the panel also exposes **Tint intensity** for tinted glass and a **Regular / Tinted** choice for categories-page glass. The **Standard** button returns Tint intensity to its default value.

Glass customization controls are inactive while Liquid Glass is off.

#### Folder Panel Background

With Liquid Glass enabled on macOS 26 or later, open **Settings → Appearance → Folder Panel Background**. **Standard** and **Clear** change the material behind an opened folder.

This control requires **Lite or Pro**. It changes the open panel, rather than the folder icon.

#### Titles and alternative icons

**Show titles** controls app and folder names beneath icons. Hiding titles requires **Lite or Pro**.

**Clear Colored Icons** uses the supplied alternative icons for supported apps. It requires **Pro** and macOS 26 or later. Apps without a supplied alternative retain their usual icon treatment.

A custom icon selected for a particular app is managed from that app's context menu.

#### Grid size and snow

**Grid size** changes the grid's sizing. Check your pages after adjusting it, particularly if you use large widgets.

**Snow** adds falling snow over the launcher. Switch it off to remove the effect.

#### Sun Background (Beta)

Enable **Sun Background (Beta)** for a sky that changes from dawn through day, sunset, and night. With **Auto** on, it follows local time. Turn Auto off to use the **Manual time** slider.

This background requires **Pro**. Enabling it replaces conflicting custom or weather background selections.

#### Weather Background (Beta)

Enable **Weather Background (Beta)** and choose a city. **Auto** uses that city's current weather without requesting your location.

Turn Auto off to select **Clear**, **Cloudy**, **Rain**, **Thunderstorm**, or **Snow** manually. The time controls let you use local time or preview a chosen time of day.

Weather Background requires **Pro** and replaces conflicting custom or sun backgrounds. The background's city and a Weather widget's city are separate choices.

#### Music Wallpaper

**Music Wallpaper** shows automatic album artwork while music is playing. When playback pauses or stops, your selected wallpaper returns. This setting requires **Pro**.

For the separate desktop wallpaper widget, see [Dock → Glowing wallpaper](dock.en.md#glowing-wallpaper).

### Widgets

Add clocks, calendars, weather, music, photos, and decorative widgets to your launcher grid. Launcher widgets require Pro, and event-list calendars also need Calendar permission.

Open the launcher tools and choose **Add widget**. Select a widget, choose one of its offered sizes, and add it to the grid. Use its context menu to edit or remove it. Widgets require **Pro**.

The editor shows controls for the selected widget. A background, font, or color control in one widget may not be present in another.

The context menu can also offer **Show Background / Hide Background**, **Change Image**, and **Delete**, depending on its type. Hiding a background keeps the widget; deleting it removes that widget from the layout.

#### Clock

Choose a digital, analog, or flip style from the clock editor. Adjust the style's available appearance controls to match the page. The widget displays time; it does not replace the timer or Pomodoro controls in the notch.

#### Calendar

Choose **Compact** for a date and week view, or **Month Grid** for a full month. **Events**, **Agenda**, **Today**, and **Split** add event lists. Event styles require Calendar access.

Events, Agenda, and Today support moving between days. **Dots** shows progress through the month or year using date calculations and does not need Calendar permission.

Use the editor to adjust text and supported background settings.

#### Weather

Choose a city and units: **Auto**, **°C**, or **°F**. Each Weather widget can use its own city.

Styles include **Minimal**, **Compact**, **Detailed**, **Forecast**, **Panel**, **Almanac**, **Horizon**, **Bold**, and **Story**. Minimal keeps the temperature prominent; Detailed and Panel add measurements; Forecast and Almanac devote more room to the outlook. Horizon uses a time-of-day scene, and Story presents weather as text.

The editor offers the controls relevant to the chosen style, such as accent color, font, filled weather icons, or Horizon background.

#### Music

Add a Music widget to control Spotify or Apple Music and display the current track. Its styles and playback controls are covered in [Music](music.en.md).

#### Image

Choose an image and adjust its framing in the editor. Use the scale and positioning controls to choose what is visible within the widget.

#### Photo Shape

Choose a photo, select a shape mask, then move and scale the image inside it. Change the mask or photo later from the editor without rebuilding your page.

#### GIF

Choose a GIF file to add your own animation. Adjust its supported placement and background settings in the editor. Remove the widget to take the animation off the page.

#### Animations

Choose a built-in animation from the collection. Only supported entries can be added; an unavailable entry remains disabled in the picker.

#### Lamp

Choose a lamp style for an ambient glow or animated light. The available styles include pixel fire, gradient lamps, halo, lava, and aurora treatments. Use the style's controls to adjust its appearance.

#### Affirmation

Enter a short message, then set its font, color, and background. Use it for a reminder, a quote, or text you want to keep on the page. The widget displays the text you enter.

Pomodoro is added through the notch or Dock rather than the full-screen widget grid.

### Spaces and themes

Use LaunchMe Spaces to keep different launcher layouts and visual setups, or install and share ready-made themes. Spaces require Pro and are separate from macOS desktop Spaces and Dock Spaces.

#### Creating a Space

Open **Settings → Apps → Spaces → Create Space**. Choose **Create with current settings** to keep your current setup as a starting point, or **Create with default layout** to start fresh.

A Space can save its app layout, folders, hidden apps, widgets, wallpaper, custom icons, workflows, and supported appearance choices. General app controls remain shared where they are app-wide.

LaunchMe Spaces require **Pro**. They are separate from both macOS desktop Spaces and Dock Spaces.

#### Editing and switching

Select a Space to use it. Choose **Edit** to change its name, icon, icon background, or **Switch shortcut**. Save your changes before closing the editor.

A switch shortcut selects that Space without opening the list. **Delete Space** removes the saved setup; it does not uninstall its apps.

#### Auto Switching

In a Space's editor, enable **Auto Switching** and add a time range and days of the week. Times use the 24-hour format. The start must be earlier than the end.

LaunchMe checks for conflicts with another Space's schedule. Adjust an overlapping range before saving it.

#### Spaces Themes

Open **Spaces Themes** from the launcher tools to browse ready-made designs. Install a theme to add it to your Spaces, then switch to it when you want to use it.

You can edit the installed Space like one you created yourself. Seasonal themes may also have their own visual or music controls.

#### Exporting a theme

Choose **Share** for a Space to export it. Check its images before sharing: wallpaper, widget photos, and custom app icons may be included in the file.

Exports omit hot keys, schedules, hidden apps, recent apps, and folder shortcuts. Dock design data is exported without local app and file pins or access bookmarks. A theme transfers the design, not access to your files.

#### Importing a theme

Choose **Import theme from file…** or open a LaunchMe theme file. If prompted, choose **Keep mine** to retain your apps and folders or **Use from theme** for the theme's arrangement. Visual styling applies in either case.

An already installed theme can be replaced. After installation, **Switch to it** uses the new Space immediately; **Later** keeps your current one.

A theme made with a newer app version may require an update. If the file is damaged or is not a supported theme, obtain a fresh copy. Importing a notch design can enable per-Space notch layouts; change this in Notch settings if you want one shared layout again.

### Workflows

Create a Workflow to open a chosen set of apps and Finder folders together. Workflows require Pro and can also be pinned to Notch or Dock.

#### Creating a Workflow

Open **Settings → Apps → Workflows → Create Workflow**. Enter a name, choose an icon or image, select the apps to launch, and add Finder folders to open.

**Launch interval (seconds)** controls the spacing between launches. Save the Workflow to use it as a launcher item. Workflows require **Pro**.

#### Running and editing

Open a Workflow to launch its configured apps and folders. Right-click and choose **Edit** to change its contents or appearance.

**Delete Workflow** removes the shortcut. It does not delete the apps or Finder folders. You can also pin a Workflow to the notch or Dock.

### Window behavior

Choose how the full-screen launcher behaves with desktop Spaces, Stage Manager, and full-screen apps. These options control the launcher window; Dock has its own visibility settings.

#### Always On

Open **Settings → General → Always On** to keep LaunchMe open in its own macOS desktop Space rather than automatically hiding it after use. You can move it between monitors.

This mode also applies to the full-screen music player. Turn it off if you want the usual temporary launcher behavior.

#### Stage Manager

**Settings → General → Stage Manager** adjusts the launcher's window behavior so it can appear above Stage Manager without being moved aside with another app's group.

#### Show over fullscreen apps

Enable **Show over fullscreen apps** to open LaunchMe over the full-screen app on your current desktop Space. With it off, invoking the launcher may move you to another desktop.

This setting controls the full-screen launcher. The Dock has its own full-screen behavior.

#### Dock icon and animations

**Show icon in Dock** controls whether the LaunchMe application icon appears in the macOS Dock. It does not enable or disable LaunchMe Dock.

**Reduce animation (Beta)** uses a simpler centered folder-opening animation. Turn it off to use the more elaborate folder transition.

### Account and maintenance

Manage your LaunchMe account, paid access, active Macs, and app maintenance. This guide also explains subscription cancellation, account deletion, updates, cache cleanup, and language preferences.

#### Sign in and license

Open **Settings → General → Account**. Use **Sign In** with your email and password, or **Sign Up** to create an account. Complete any email confirmation requested. **Forgot password** sends a recovery request for the entered email.

After a purchase, sign in with the account associated with it. Use **Refresh License** if your plan has not appeared.

#### Plans

**Lite** includes hiding apps, hiding titles, and Glass Settings. **Pro** includes those features plus custom backgrounds, advanced customization, widgets, Spaces, Workflows, and the full notch experience.

Dock can be used for basic app and folder access without Pro. Its widget gallery, presets, Dock Spaces, and premium appearance controls require Pro. A crown identifies a paid control.

Open the upgrade screen for the plans and purchase terms currently offered. Paid access also requires an active Mac slot.

#### Active devices

Under **Account → Active devices**, check how many Mac slots are in use. **This Mac** marks your current computer; **Refresh** updates the list.

A Mac marked **Waiting for a free slot** cannot use paid features until a slot is available. Remove a Mac you no longer use and confirm the removal. You can sign in on it later if a slot is free.

#### Subscription cancellation

For a recurring plan, expand **More** in Account settings. Review the billing period, choose **Cancel subscription**, and confirm.

Cancellation stops renewal at the end of the paid period. Access continues until then. The account section shows when cancellation is already scheduled. Lifetime plans do not have a renewal to cancel.

#### Delete account

**Delete account** permanently removes your account. The confirmation cannot be undone. An active subscription is canceled immediately, and one-time purchases are not refunded automatically.

Use **Sign Out** if you only want to disconnect this app from your account.

#### Updates

Open **Settings → General → Updates**. **Automatically check for updates** enables automatic checks; **Check for updates now** starts a manual check. Follow the updater when a release is available.

The panel shows the last check time. Updating may be necessary before importing a theme made by a newer version.

#### Cache and language

**Clean Cache** removes unused folder icon cache files and unused widget images or animations. It preserves assets used by current items and reports the space freed after cleanup.

Under **Language**, choose an app language or **System language**. This saves your preferred language for LaunchMe.

### Menus

Find the commands available in the menu bar, launcher tools, and app context menus. The commands you see depend on the current view, item, and feature access.

#### Menu bar

- **Show / Hide:** toggle the launcher.
- **Settings:** open LaunchMe settings.
- **Notch settings:** open the notch's settings window.
- **Dock settings:** open the Dock's settings window.
- **Show / Hide Dock:** toggle Dock visibility.
- **Quit LaunchMe:** quit the app and its background features.

#### Launcher tools

**Spaces Themes**, **Add widget**, **Appearance**, **Sort**, **Create folder**, **Tutorial**, and **Settings** provide access to the features described above. Grid-specific tools require Classic view. Tutorial appears when the app's tutorial settings allow it.

#### App context menu

**Open**, **Rename**, **Add to Notch**, **Add to Dock**, **Customize icon**, **Reset icon**, **Hide app**, and **Delete from Mac** appear according to the app's state and your access. An already pinned item can show its existing placement instead of another add action.

### Troubleshooting

Resolve missing grid tools, locked paid features, clipboard file-access issues, and layout or theme import problems. Start with the section that matches the behavior you see.

#### Grid tools are missing

Turn on **Settings → General → Classic view**. Categories-only view does not show the grid's folder, sorting, and widget tools.

#### A paid feature is locked

Check the plan shown in Account, use **Refresh License**, and confirm that this Mac has an active slot. Sign in to the account used for the purchase.

#### Clipboard cannot read a file

Grant access to the containing folder. For screenshots, also check the selected screenshot destination. Granting Full Disk Access for Focus does not replace these folder grants.

#### A layout or theme cannot be restored

Launchpad restoration needs a readable old database. Theme import needs a supported, intact theme file and an app version new enough to read it. The error message tells you which condition to address.

## Notch

### Getting started

Enable LaunchMe Notch and choose how to expand it from the top of your display. The full Notch experience requires Pro and is currently in Beta.

Open **Settings → General → LaunchMe Notch**, enable it, and follow the permission setup. The full notch requires **Pro**. Without Pro, the welcome view introduces the feature and offers an upgrade.

Move the pointer over the notch area to reveal it. You can change this to a click in **Notch settings → General → Expand**. Open Notch settings from the LaunchMe menu bar menu or the gear in the expanded notch.

LaunchMe Notch is in Beta.

### Home and navigation

Switch between the Notch home layout, Pocket, Clipboard, and Timer. You can also choose what appears in the compact view when no temporary alert or timer takes priority.

The expanded notch has shortcuts for **Home**, **Pocket**, **Clipboard**, **Timer**, **Add widgets**, and **Settings**.

**Home** returns to your widget and shortcut layout. **Pocket** opens the file area. **Clipboard** shows clipboard history. **Timer** opens the countdown controls. These views share the same notch; switching between them does not delete their contents.

#### Compact notch

The compact view can show artwork and activity without opening the full panel. Enable **Always show compact notch** to keep it visible.

When this option is off, the notch tucks away until you hover over its area. If it seems to have disappeared, check this option before changing its size or display.

#### Idle Activity

Open **Notch settings → General → Idle Activity**:

- **None:** no selected idle activity.
- **Playing:** use the music presentation.
- **Weather:** use the weather presentation for your chosen city and units.
- **Duo:** use the combined idle presentation.

An active timer or temporary alert can take priority over the idle view.

### Widgets and shortcuts

Build your Notch home view with widgets and shortcuts to apps, folders, and Workflows. Arrange the available blocks to fit your layout and choose whether to share it across LaunchMe Spaces.

#### Add widgets

Expand the notch and click **Add widgets**. Choose a supported widget and size. Use its edit controls to change the style, text, background, or other settings offered for that widget.

The notch can host Clock, Calendar, Weather, Music, Image, Photo Shape, GIF, Animations, Lamp, and Affirmation widgets, as well as Pomodoro. The available sizes are adapted to the notch layout.

For Clock, Calendar, Weather, and decorative widget settings, see [Full screen launcher → Widgets](full-screen-launcher.en.md#widgets). The music styles are covered in [Music](music.en.md).

#### Pin apps, folders, and Workflows

Right-click a supported item in LaunchMe and choose **Add to Notch**. You can also drag supported launcher items into the notch's shortcut area.

Click a pinned app to launch it, open a folder to reach its contents, or run a Workflow from its shortcut. **Remove from Notch** removes the shortcut without uninstalling an app or deleting the source folder.

#### Arrange the home view

Move supported widgets and shortcut blocks to arrange the home view. A widget's dimensions affect how much room it takes. Remove widgets you no longer need from the notch layout rather than deleting their source images or apps.

The layout can be shared across LaunchMe Spaces or stored separately for each one.

### Pocket

Keep file shortcuts nearby in Notch Pocket and drag them into other apps when needed. Pocket points to your original files; AirDrop sharing continues through the macOS sharing interface.

Drag files into **Pocket** to keep them nearby while you work. The notch separates files, launcher shortcuts, and folder shortcuts into their own areas.

Drag a file out of Pocket when you need it in another app. A Pocket entry points to the file; avoid treating Pocket as a separate backup of the original.

#### AirDrop

Drag files onto the notch's **AirDrop** drop area to start sharing them through macOS. Complete recipient selection in the system sharing interface.

AirDrop availability and recipients depend on your Mac's AirDrop settings and nearby devices. The drop area does not send files to a recipient automatically.

### Clipboard

Browse, filter, favorite, and copy items from the clipboard history in Notch. This is the same history used by launcher search, including files and screenshots with folder access.

Open **Clipboard** in the notch toolbar. This is the same history used by the launcher's Clipboard search.

Choose **Recent**, **Images**, **Colors**, **Text**, **Links**, **Files**, **Favorites**, or **Screenshots** to narrow the view. On a card, use the star to change its favorite status, the copy button to copy it again, or the trash button to remove the history entry. File and image cards can be dragged into supported destinations.

Copying an item puts it on the clipboard. Paste it in the destination app to use it. Removing a Clipboard card does not delete the original file.

#### Access to files

Copied text, links, and images need no folder permission. For files in Desktop, Documents, Downloads, or another protected folder, allow access to that folder when prompted.

Use **Grant Access to Specific Folders** to grant access in advance. Select several folders with **⌘-click**. Full Disk Access used for Focus does not replace this step.

#### Screenshots

The Screenshots category collects new screenshots from your selected screenshot folder. Use **Choose Screenshot Folder…** if macOS saves them somewhere other than the selected location.

Grant access to the save folder when requested. The usual destination is Desktop, but it can be changed in macOS screenshot options.

### Timer

Start a countdown in Notch and choose the sound that plays when it finishes. The timer keeps running as you switch Notch views and is separate from Pomodoro sessions.

Open **Timer** in the notch toolbar. Choose a preset or set a duration, then click **Start timer**. Use the running countdown's pause, resume, and cancel controls as needed.

The timer continues while you switch to other notch views. It is separate from Pomodoro, which manages a cycle of focus sessions and breaks.

#### Completion sound

Open **Notch settings → Timer → Completion sound**. Choose a sound or **None**, and use the preview button to hear the selection.

The choice is saved automatically. The sound plays once when the timer ends.

### Pomodoro

Use Pomodoro to alternate focus sessions with short and long breaks. The Notch and Dock widgets control the same session, with shared durations, sounds, and daily totals.

Add **Pomodoro** from the notch widget picker. Click **Start** to begin a focus session. **Pause** holds the remaining time; **Resume** continues it.

The default cycle is **25 minutes of focus**, a **5-minute short break**, and a **15-minute long break after four completed focus sessions**.

#### Session settings

Open the widget's gear or **More actions → Pomodoro settings**. Set:

- **Focus duration:** 1–180 minutes.
- **Short break:** 1–60 minutes.
- **Long break:** 1–120 minutes.
- **Sessions before a long break:** 1–12.
- **Start breaks automatically** and **Start focus automatically**.
- **Completion sound** and **Volume**.

Duration changes apply to the next stage. Breaks start automatically by default; the next focus session waits for you unless you enable automatic focus starts.

#### More actions

**Skip stage** advances without counting a skipped focus session as completed. **Restart stage** starts the current stage again. **Reset cycle** returns to the beginning of the focus cycle.

The widget shows today's completed sessions and focus time. Those totals count completed focus sessions.

#### Using Pomodoro in the Dock

The Dock's Pomodoro widget controls the same session. Starting, pausing, or changing it in one place updates the other. Adding both views does not create two independent timers.

If your Mac sleeps through a stage ending, LaunchMe reconciles that stage when it resumes. It does not fill the missing time with a series of completed focus sessions.

### Music

See the current track in the compact Notch and expand it for playback controls. Spotify and Apple Music controls require Automation access; Music widgets provide additional player styles.

The compact notch can show album art and playback activity. Expand it for playback controls. A Music widget on the home view offers additional styles and a full-screen player control.

Spotify and Apple Music controls need **Automation** access. See [Music → Connect a player](music.en.md#connect-a-player) for setup and [Full-screen player](music.en.md#full-screen-player) for the larger listening view.

### Appearance

Change the expanded Notch background, compact dimensions, and interaction feedback. Notch appearance is configured separately from the full-screen launcher wallpaper.

Open **Notch settings → General** to change the notch itself.

#### Background

Choose **Black**, **Glass**, or **Image** for the expanded notch. With Image selected, **Choose…** opens an image picker and **Change…** replaces the current image. The image stretches across the expanded panel, so a wide composition usually fits more naturally.

Glass backgrounds have their own style choices, including **Clear** and **Black Glass**. These controls affect the notch rather than the launcher wallpaper.

#### Compact size

Use **Height** and **Width** to adjust the collapsed notch. **Reset to default size** restores its default dimensions.

If you want more information on the home page, change its widget layout rather than stretching the compact notch.

#### Haptic feedback and alert duration

**Haptic feedback** enables supported feedback during notch interactions. **Alert duration** controls how long temporary alerts stay visible. Battery and Connectivity sections also provide their own alert duration controls.

### Displays and visibility

Choose the display used by Notch and control when it stays out of view. Options include hiding while gaming and excluding the Notch panel from screen capture.

#### Display on

Choose **Automatic** or a connected display in **Notch settings → General → Display on**. Check this selection if the notch appears on a different monitor than expected.

#### Hide while gaming

Enable **Hide while gaming** to hide the notch when a full-screen game is frontmost. Turn it off if you want the notch available during those sessions.

#### Hide from screen capture

Enable **Hide from screen capture** to keep the notch out of screenshots and screen recordings. This affects the notch panel; it does not hide the contents of other apps.

### Spaces

Choose whether all LaunchMe Spaces use one Notch home layout or keep separate layouts. These settings follow launcher Spaces and are independent of Dock Spaces.

Open **Notch settings → Spaces** to choose whether LaunchMe Spaces share one notch layout.

With **Use one homepage layout with widgets for all spaces** enabled, every LaunchMe Space uses the shared home setup. Turn it off to keep a separate notch home page for each Space, including widgets, pinned apps and folders, and background.

A Space inherits the shared layout until you customize it. These are the full-screen launcher's Spaces, not the Dock's independent Spaces.

### Battery

Show battery and charging alerts in Notch and choose when low-battery warnings appear. Adjust their duration and labels to suit the information you want to see.

Open **Notch settings → Battery** to enable charging, full-battery, and low-battery alerts.

Set **Duration** for the alert, enable **Notify on low power mode**, and use **Warn on low battery** with a threshold to choose when a warning appears. **Hide label** and **Hide percentage** simplify the alert's presentation.

### Connectivity

Use Notch alerts for Bluetooth connections and network changes. Accessory battery warnings depend on the information reported by the device, and Bluetooth alerts require Bluetooth permission.

Open **Notch settings → Connectivity** to enable Bluetooth connection and disconnection alerts and network-change alerts.

Choose the alert duration. The accessory low-battery controls let you enable a warning and set a threshold where battery information is available from the device.

Bluetooth alerts require Bluetooth permission. An accessory that does not report a battery level cannot provide the same battery information as one that does.

### Focus

Show your active macOS Focus state in Notch and choose which supported alerts remain allowed. Reading the Focus state requires Full Disk Access.

Enable Focus alerts in **Notch settings → Focus** to show your active macOS Focus state. **Replace waveform during focus** uses the Focus symbol in place of the compact music waveform.

Choose whether to hide the label and which supported alerts remain allowed during Focus: **Battery**, **Connectivity**, **Display**, and **Sound**.

Focus detection needs **Full Disk Access** because its state is stored in a protected macOS folder. If no Focus state is shown, review that permission first.

### Calendar events

Show upcoming calendar events in Notch and use event-list calendar widgets. These features require Calendar access; date-only calendar styles do not read your events.

With Calendar access, the notch can show an upcoming event. Calendar widgets with event-list styles use the same macOS permission.

Grant access from **Notch settings → Permissions**. Date-only calendar styles do not need to read your events.

### Permissions

Review the macOS permissions used by Notch and grant access for the features you choose. Notch and Dock share permission status, but individual features need different types of access.

Open **Notch settings → Permissions**. Grant the permissions for the features you use:

| Permission | Used for |
| --- | --- |
| Full Disk Access | Reading macOS Focus state. |
| Calendar | Upcoming events and event-list widgets. |
| Bluetooth | Accessory connection and disconnection alerts. |
| Automation | Controlling Spotify and Apple Music. |
| Clipboard folder access | Reading and copying files from protected folders. |
| Screenshots | Reading new files from the screenshot save folder. |

Use **Grant** or **Open Settings** beside the permission. Some macOS changes need an app restart before they take effect. Dock and Notch share their permission status.

### Troubleshooting

Check Notch visibility, music control permissions, clipboard file access, and layout changes between Spaces. Each section explains the settings to review for that symptom.

#### The notch does not appear

Check **Settings → General → LaunchMe Notch**, then the display selection. If **Always show compact notch** is off, hover over the notch area. Also check whether **Hide while gaming** is active.

#### Music is visible but controls do not work

Start playback in Spotify or Apple Music and allow Automation for that app. Metadata and playback control are not the same permission-dependent action.

#### Clipboard shows “Need to Grant Access”

Allow the folder containing that file. If the file was moved or deleted, grant access to its new location or copy it again from Finder.

#### A layout changes when switching Spaces

Open **Notch settings → Spaces**. Enable the shared layout if you want the same home page everywhere. Imported themes may have enabled per-Space layouts to show their notch design.

## Dock

### Getting started

Enable LaunchMe Dock and add your first app or folder shortcut. Basic app and folder access is available without Pro; LaunchMe Dock is currently in Beta.

Open **LaunchMe menu bar → Dock settings → General** and enable the Dock. You can also enable **LaunchMe Dock** in the main app's General settings.

To add your first item, right-click an app or folder in LaunchMe and choose **Add to Dock**. If the Dock is off, the command reads **Enable Dock and add**. Right-click the Dock's background to add more items or open its widget gallery.

Press **⌃⌥⌘D** to show or hide the Dock. If this combination conflicts with your main LaunchMe shortcut, the main shortcut takes priority.

LaunchMe Dock is in Beta.

### Apps and folders

Add app pins, LaunchMe folders, Finder folders, and Workflows to the Dock. You can also show running apps, copy app pins from the macOS Dock, and open files with an app by dragging them onto it.

#### Add an app

Right-click the Dock and choose **Add application…**, then select the app. You can also add an app from its context menu in the full-screen launcher or drag a supported app item into the Dock.

Click the icon to launch the app or bring it forward. Right-click for **Open**, **Show in Finder**, icon customization, and **Quit** when it is running.

**Remove from Dock** removes the pin. It does not quit or uninstall the app.

#### Copy apps from the macOS Dock

Open **Dock settings → Dock Items → Copy apps from macOS Dock**. Enable it to bring your macOS Dock's app pins into LaunchMe Dock.

Turning the option off removes the copied pins. Apps you added manually remain. This copies app entries; it does not move or delete apps on your Mac.

#### Active apps

Choose one of the active-app views under **Dock settings → Dock Items**:

- **Show folder with active apps:** groups running apps behind an Active apps icon.
- **Show active apps in dock:** places active apps in the Dock row.

Enabling one turns the other off. Open the Active apps folder to select an app. Its context menu includes **Quit all apps**. Apps may ask you to save documents when they receive a quit request.

An active-app entry is generated from running apps rather than a saved pin. It does not have the same removal action as an app you pinned yourself.

#### Drop a file onto an app

Drag a file onto an app icon to open it with that app. The app decides whether it supports the file type.

When dragging over a supported folder or app group, pause over it to reveal its contents, then continue to the app you want. This is useful when the destination app is inside a folder rather than directly in the Dock.

#### LaunchMe folders

Choose **Add LaunchMe folder** from the Dock's context menu, then select one of your launcher folders. Click it to open its contents in the Dock.

A LaunchMe folder keeps its source identity, including the Space it came from. Removing its Dock shortcut does not delete the original folder.

#### Finder folders

Choose **Add Finder folder…** and select a real folder on your Mac. Click it to browse its contents. Use **Open in Finder** or its **Open** command when you want the Finder window.

Files in the expanded folder use previews where available. Click a file to open it with its default app. Its context menu offers **Show in Finder**, **Quick Look**, **Copy File**, **Copy Name**, **Copy Path**, and **Move to Trash**. Apps and folders can also offer **Add to Dock**. Use their context menus for file operations, or drag a file out into another app. **Show Apps names in dock** and **Show files and folders names in dock** control labels in the Dock and its folder views.

If folder access becomes unavailable, add the folder again to restore access. A shortcut does not grant access to every protected location inside it.

#### Workflows

Choose **Create Workflow** from the Dock's context menu. Set its name, icon, apps, Finder folders, and launch interval, then save it. Right-click an existing Workflow and choose **Edit Workflow** to change it.

Workflows require **Pro**. Opening one launches its configured apps and folders. Removing it from the Dock removes the shortcut; deleting the Workflow removes the saved Workflow itself.

### Finder, Downloads, and Trash

Add built-in Finder, Downloads, and Trash items to LaunchMe Dock. Folder and Trash access may require macOS permissions, while permanent deletion always needs special care.

These system items can be enabled independently in **Dock settings → Dock Items**. They can also be moved within the Dock row.

#### Finder

Enable **Show Finder icon** for quick access to Finder. Its context menu includes **Show All Windows** and **Hide**.

**Remove from Dock** hides this icon. Turn **Show Finder icon** back on to restore it.

#### Downloads

Enable **Show Downloads** to add the Downloads stack. It previews recent files; click it to browse the folder.

Files are ordered with newly added downloads first. Incomplete browser downloads are omitted from the usable-file listing. Open or drag a completed file from the drawer as you would from another Dock folder.

If access is denied, allow the Downloads folder when macOS asks.

#### Trash

Enable **Show Trash** to browse the Trash from the Dock. Right-click it for **Open Trash** or **Empty Trash…**.

Inside the Trash view:

- **Put Back** restores an item when its original location can be recovered.
- **Delete Permanently…** removes that item permanently.
- **Empty Trash…** permanently removes the Trash's contents.

Permanent deletion asks for confirmation and cannot be undone. Review the files before accepting it.

If LaunchMe cannot read the Trash, use **Open Access Settings…**, enable **Full Disk Access**, and restart LaunchMe. You can still open the Trash in Finder to manage it there.

#### Safari commands

Right-click Safari in the Dock or an app drawer for **New Window** and **New Private Window**.

These commands need Accessibility access. If prompted, open **System Settings → Privacy & Security → Accessibility**, enable LaunchMe, then choose the command again. Opening Safari itself does not require these extra window commands.

### Layout

Arrange Dock items, adjust size and length, and choose fixed or floating placement. Visibility controls determine when LaunchMe Dock appears at the bottom edge or alongside the system Dock.

#### Rearrange items

Drag a Dock item left or right. The surrounding items move to show the insertion point; release to keep the new order.

Right-click the background and choose **Add separator** to divide groups. Move separators like other items, or remove them when you no longer need the division.

#### Size and length

Open **Dock settings → Appearance**:

- **Size** sets the preferred scale of the Dock.
- **Maximum Dock length** limits how much of the display width it can occupy, from 20% to 100%.
- **Auto height** scales the row down to fit the length limit.
- **Bottom distance** sets the gap from the bottom edge in the fixed position.

With Auto height off, the Dock keeps its chosen size and scrolls when it reaches the length limit. Scroll horizontally over the Dock to reach items outside the visible area. A mouse wheel can also scroll the row.

#### Floating

Enable **Dock settings → General → Floating** to drag the Dock to another position on the display. Drag its background rather than an item. With Dock Spaces visible, use the move handle so you do not reorder an item by mistake.

The floating position is remembered per display. Size and maximum length still apply.

#### Reveal from the bottom edge

**Reveal from the bottom edge** controls LaunchMe Dock, separately from the macOS Dock's setting. When using LaunchMe Dock's bottom-edge reveal behavior, move the pointer to the bottom edge to show it. It hides after the pointer leaves.

Open drawers and active interactions can keep it visible so you can finish using them.

#### Appear with the system Dock

With **Floating position** enabled, turn on **Appear with the system Dock** to show the floating LaunchMe Dock alongside the macOS Dock. It waits about two seconds after the pointer leaves before hiding.

This option is unavailable while **Keep the system Dock hidden** is enabled, because there is no visible system Dock to follow.

#### Full-screen apps

LaunchMe Dock hides on a display occupied by a full-screen app. It also gets out of the way when the main LaunchMe window takes over the display.

The full-screen launcher's **Show over fullscreen apps** setting does not change Dock into an overlay for full-screen apps.

#### Reset position

Use **Dock settings → General → Reset position and show Dock** if you have lost track of the floating bar. It resets the saved floating position for the current display. Check **Display**, **Floating position**, and **Reveal from the bottom edge** as well if the Dock still appears somewhere other than expected.

### The macOS Dock

Choose how Apple’s Dock behaves while LaunchMe Dock is enabled. LaunchMe can apply system Dock visibility settings and restores the previous settings when these controls are turned off or LaunchMe exits.

Open **Dock settings → General → System dock** to choose how LaunchMe works alongside Apple's Dock.

#### Automatically hide the system Dock

With this enabled, the macOS Dock appears only when the pointer reaches its screen edge. LaunchMe applies this while LaunchMe Dock is enabled.

In its fixed position, LaunchMe Dock yields when the macOS Dock appears, so the two do not compete for the same area.

#### Keep the system Dock hidden

This suppresses the system Dock's appearance at the edge. The system Dock process continues running for macOS features. This option overrides automatic system Dock hiding.

When it is enabled, the **LaunchMe Dock** group exposes its own **Reveal from the bottom edge** control. Enable that control for bottom-edge reveal, or leave it off to keep LaunchMe Dock visible.

#### Restoring system settings

LaunchMe restores the previous system Dock settings when you turn off these controls, disable LaunchMe Dock, or quit LaunchMe. Applying a change briefly restarts the system Dock, so a short visual interruption is expected.

If an error appears, use **Retry** to apply or restore the settings again.

### Displays

Show LaunchMe Dock on one monitor or across connected displays. With Pro, separate Dock Spaces can give each screen its own active setup.

#### One display or all displays

Open **Dock settings → General → Display**. Choose **Default display**, a named monitor, or **All displays**.

All displays shows the Dock on connected screens. Without separate display Spaces, they use the selected shared Dock setup. Floating positions are remembered separately for each physical screen.

#### Different Dock Spaces on different screens

Enable **Show separated Dock Space on each screen** in General. This requires **Pro** and enables Dock Spaces.

Open **Dock settings → Dock Spaces**. Use the display button on a saved Space to assign it to a screen. Each screen can then keep a different active Dock Space.

While separate display Spaces are enabled, the ordinary Display picker is disabled; use the Space-to-screen assignments instead.

### Dock Spaces

Save and switch between independent Dock layouts with their own items, widgets, and appearance. Dock Spaces require Pro and are separate from launcher Spaces and macOS desktop Spaces.

Open **Dock settings → Dock Spaces** and enable **Enable Dock Spaces**. Dock Spaces require **Pro**.

Each Space saves its items, widgets, appearance, size settings, clock preferences, and visibility choices for system items. General controls such as enabling the Dock, display mode, and system Dock coordination remain app-wide.

Dock Spaces are independent of the full-screen launcher's Spaces and macOS desktop Spaces.

#### Create, copy, and delete

Choose **Create Dock Space → Create New** for a fresh Space, or **Copy Existing Space** to start with the current one. The widget gallery opens so you can build the new layout.

Use the duplicate button on a saved Space to copy that particular setup. Use its trash button to delete it. At least one Space must remain.

#### Switch Spaces

Click a Space preview in settings, or use the Spaces interface above the Dock. Enable **Show Spaces Interface on Dock Hover** to reveal those controls while the pointer is over the Dock.

You can also switch while pointing at the Dock:

- **⌘← / ⌘→:** previous or next Dock Space.
- **Hold ⌘ and swipe horizontally:** switch with the trackpad.

With separate display Spaces enabled, switching applies to the Dock on the display you are using.

#### Reorder Spaces

In the saved Spaces list, drag the handle on a Space card to change its order. The order is used for browsing the Spaces, so put frequently used setups next to each other.

### Appearance

Customize Dock colors, backgrounds, glass styles, and icon labels. Presets, palettes, and premium appearance controls require Pro; each option below explains what it changes.

#### Presets

Right-click the Dock, open **Widgets**, and select **Presets** in the gallery. A preset applies a set of widgets and colors together.

Applying one replaces the existing widget set while preserving non-widget pins and separators. It also enables the Active apps folder. If you want to keep both designs, copy the current Dock Space before applying a preset.

Presets require **Pro**.

#### Color palettes

Open **Dock settings → Appearance → Color palettes**. A palette applies paired colors to the Dock background and widget backgrounds. **Show all** reveals the rest of the collection; **Show less** collapses it.

Fine-tune either color below after applying a palette. A palette changes colors, whereas a preset also changes the widget set. Color palettes require **Pro**.

#### Palette by reference

In **Appearance → Palette by reference**, drop a photo or click to choose one. LaunchMe creates **Balanced**, **Dark**, and **Soft** palette suggestions based on that image.

Select a suggestion to preview it on the Dock. **Apply** keeps the preview; **Cancel** returns to your saved appearance. This generates colors, rather than using the photo as the Dock background.

Palette by reference requires **Pro**.

#### Dock and widget backgrounds

**Dock background** and **Widgets background** are separate controls. Each can use:

- **Liquid Glass:** a glass material.
- **Color filled:** a solid color with opacity controls.
- **Image:** an imported picture.

Use **Choose image…**, **Change image…**, or **Remove image** for an image background. Supported formats include PNG, JPEG, HEIC, and other image types accepted by the picker.

These background customizations require **Pro**. A widget that draws its own artwork may cover part of the shared widget background.

#### Glass style and light/dark mode

When a background uses Liquid Glass, choose **Clear**, **Tinted**, or **System** under **Glass style**. System follows macOS material and accessibility settings.

**Dark/Light mode sync** chooses between **System** and **Use LaunchMe settings**. With System sync and Tinted glass, **Tint** can be **Auto**, **Dark**, or **Light**.

These settings let the Dock follow the Mac independently of a fixed launcher theme, or deliberately match LaunchMe's appearance.

#### Icon appearance and names

**Clear Colored Icons** uses supplied alternative icons for supported apps. **Custom Icons Sync** uses your custom LaunchMe app icons in the Dock. Both controls require **Pro**.

**Show Apps names in dock** controls labels for apps and Workflows. **Show files and folders names in dock** controls file and folder labels. These are useful when an icon alone is not distinctive enough.

### Widgets

Add and edit Dock widgets for time, calendars, weather, system information, music, and more. The gallery requires Pro, and some widget types support multiple instances.

Right-click the Dock and choose **Widgets**. Search the gallery or select a category. Click **Add** for a widget, or **Apply** when changing an existing single-instance widget's style.

Calendar, Weather, System, GIF, and Animations support multiple instances. For the other types, choosing another style updates the existing instance rather than adding an independent second copy.

Right-click an editable widget and choose **Edit widget**. **Remove from Dock** removes it from the current setup. The gallery and premium widget customization require **Pro**.

#### Clock

The Clock gallery offers **Compact**, **Standard**, **Minimal**, **Flip**, **Classic**, **Dots**, **Modern**, **Minimal Analog**, **Lens**, **Lens Squared**, **Mist**, **Ring**, **Disc**, **Orbit**, and **Matrix**.

Open **Dock settings → Clock** for **24-hour time**, **Show date**, and **Time zone**. System time zone follows the Mac; select a named zone to use another region. Date display depends on the chosen style.

The default basic clock is available in the starting Dock. Selecting additional gallery styles requires Pro.

#### Calendar

Choose a compact date, full **Month Grid**, **Events**, **Agenda**, **Today**, **Split**, or **Dots** presentation. Dots is offered for month and year progress, including different widths.

Event-list styles need Calendar access. Date and progress styles do not. Supported styles let you navigate days or select a date. Right-click **Edit widget** to adjust the calendar's style, text, and supported appearance options.

Multiple Calendar widgets can be added, so a date-only card and an agenda can sit side by side.

#### Weather

Right-click the widget and choose **Edit widget** to select its city, units, and presentation. Multiple Weather widgets can use different cities.

The gallery includes single-measurement cards for **Temperature**, **Sky condition**, **Humidity**, and **Wind**, plus **Minimal**, **Compact**, **Detailed**, **Forecast**, **Panel**, **Almanac**, **Dynamic**, **Horizon**, **Bold**, and **Story** layouts.

Dynamic uses the time-based sky treatment. Horizon has its own sun-path presentation. The wider information styles make room for forecasts or additional measurements. Hover over supported weather cards for a larger details view.

The editor exposes style-specific choices such as font, filled icons, accent, and sky background. The Dock Panel follows the shared widget background rather than a separate accent fill.

#### System

Add one or more System cards to monitor **CPU**, **RAM**, **Network**, **Temperature**, and **Disk**. Most metrics have a compact or chart presentation.

Hover over CPU or RAM to see the top three apps. CPU is shown as a share of total processor capacity; RAM uses resident memory and includes helper processes. Network shows download and upload speed over Wi-Fi and Ethernet. Disk shows storage information.

Temperature readings depend on sensors available on your Mac. A missing reading is shown as unavailable rather than an estimated temperature. Hover can show additional sensor readings when they are available.

#### GIF

Choose **Square**, **Wide**, or **Panorama**, then use **Edit widget → Choose GIF…**. Drag the animation to reposition it or use the **Horizontal** and **Vertical** sliders. **Reset position** centers the framing again.

**Show widget background** controls the background treatment. Use **Replace GIF…** to change the animation.

Imports accept GIFs up to **24 MB**, **2048 pixels per side**, and **300 frames**, with a decoded size up to **96 MB**. If an import fails, reduce the dimensions, frame count, or file size.

#### Animations

Choose a built-in animated cat from the gallery. The collection includes several colors and seasonal Christmas or tree versions.

Use **Edit widget** to change its available animation settings. Multiple Animations widgets can be placed in the same Dock.

#### Pomodoro

Find **Pomodoro** in the Clock category. Start or pause with the main control. The more menu includes **Skip stage**, **Restart stage**, **Reset cycle**, **Stop**, today's totals, and **Pomodoro settings**.

It uses the same focus session as the notch. Focus and break durations, automatic starts, sound, and volume are explained in [Notch → Pomodoro](notch.en.md#pomodoro).

#### Music

The Music category includes compact and full players, hover-controls versions, cover layouts, album artwork, and adaptive or customizable vinyl. See [Music → Dock players](music.en.md#dock-players) for the differences.

#### Mindfulness and Background Sounds

Open **Widgets → Mindfulness** and add **Background Sounds**. Choose a sound, press play, and use the widget's volume slider.

Sounds download on first playback and are available offline afterward. Details, the sound list, and download troubleshooting are in [Music → Background Sounds](music.en.md#background-sounds).

### Glowing wallpaper

Use the Glowing wallpaper widget to change your macOS desktop wallpaper and adjust its brightness. You can also apply the selected design to the full-screen launcher through a separate action.

Add **Wallpaper → Glowing** from the widget gallery. This widget changes your **macOS desktop wallpaper**, not just the Dock's surface.

Use the previous and next controls to browse styles. Open **Wallpaper styles** for the full collection. The widget's dark bar adjusts brightness.

#### Light and Abstract collections

Choose a style from **Light** or **Abstract**. Light includes scenes such as Sunrise and Bali Sunset; Abstract contains color-based designs such as Silk, Prism, and Aurora.

Use **Grain effect** and **Intensity** to add or reduce texture. The style picker previews the design before you move on to other choices.

#### Automatic and manual brightness

Press play to follow local time, updating every hour. The widget shows **Auto · every hour** while this is active.

Drag the brightness bar for a manual adjustment. This pauses Auto and changes the status to **Manual**. Press play again when you want time-based updates.

#### Rings

Open the **Rings** collection, drop an image or click to choose one, and adjust **Ring size**. Use the live preview, then click **Apply** to keep the result.

The Rings editor needs a readable image and a working Metal preview. If it cannot load, choose another image or try again.

#### Use in the full-screen launcher

Choose **Set as background in the main LaunchMe window** to apply the selected design to the launcher's background as well. This is separate from setting the desktop wallpaper.

If applying a wallpaper fails, use **Try again**. Check the result on the desktop or launcher corresponding to the action you selected.

### Permissions

Review the permissions needed by Dock music controls, calendars, folders, Trash, and Safari commands. Grant access for the features you use rather than enabling every permission.

**Dock settings → Permissions** shows the permissions shared with Notch. Grant those required for the features you use.

Music controls use **Automation**. Calendar event styles use **Calendar**. Finder folders and Downloads can need folder access. Trash browsing needs **Full Disk Access**. Safari's extra window commands need **Accessibility**.

Basic app launching does not require you to grant every permission in the list.

### Context menus

Find the commands available when you right-click the Dock background, an app, or a widget. Removing a Dock shortcut does not uninstall its app or delete the original Finder folder.

Right-click the background for **Add application…**, **Add LaunchMe folder**, **Add Finder folder…**, **Create Workflow**, **Add separator**, **Widgets**, and **Dock settings**.

An app adds **Open**, **Show in Finder**, icon controls, and **Quit** while running. Safari adds its window commands. Editable widgets add **Edit widget**. Workflows add their editor. Trash and Finder show their own commands described above.

**Remove from Dock** removes a pin or hides a built-in item. It does not uninstall an app or delete a Finder folder.

### Troubleshooting

Resolve Dock visibility, system Dock settings, folder access, app quitting, and saved-layout problems. Start with the symptom below and check the related settings before rebuilding your setup.

#### I cannot see the Dock

Enable it in General settings, try **⌃⌥⌘D**, and check the selected display. Review Reveal from the bottom edge, full-screen app visibility, and **Appear with the system Dock**. Use **Reset position and show Dock** if the floating position is the problem.

#### The system Dock changed or flashed

System Dock controls briefly restart Apple's Dock when applied. LaunchMe restores the earlier settings when those controls are turned off or LaunchMe exits. Use **Retry** if settings could not be applied or restored.

#### A folder will not open

Add it again to restore access. For Downloads, allow that folder. For Trash, enable Full Disk Access and restart LaunchMe. Check in Finder that the original location still exists.

#### An app will not quit

Look for an unsaved-document dialog in the app. If LaunchMe reports that it could not send Quit, use the app's own menu. Quit is a normal request, not a force-quit command.

#### A widget or appearance control shows a crown

It requires Pro. If you already have Pro, refresh your license in the main Account settings and check this Mac's active device slot.

#### The layout could not be saved

LaunchMe keeps the existing saved data when it cannot save a change. Avoid rebuilding the layout repeatedly; resolve the reported save problem and try the change again.

An item marked as requiring a newer version needs an app update before it can be used.

## Music

### Connect a player

Connect Spotify or Apple Music to LaunchMe using macOS Automation permission. Other media apps and browser playback can supply Now Playing information, with controls depending on the source.

Start playback in **Spotify** or **Apple Music**, then open a Music widget in LaunchMe, the notch, or the Dock. LaunchMe uses the player you already have; you do not need to sign in to the music service again inside LaunchMe.

When macOS asks to let LaunchMe control the player, allow it. If you previously denied access, open **System Settings → Privacy & Security → Automation** and enable the music app under LaunchMe.

#### Connect player

If a widget shows **Connect player**, open Spotify or Apple Music first, then click it. macOS needs the target app running before it can present the Automation request.

Notch and Dock share the same music access. You can review Automation in either one's Permissions section.

#### Other Now Playing sources

LaunchMe also reads the active macOS Now Playing session for other media apps and browser playback. Track information, artwork, seeking, and skipping depend on what that source exposes to macOS.

A playing Spotify or Apple Music session takes priority over the system fallback. Shuffle is available through the native Spotify and Apple Music connection; the favorite action is specific to Apple Music. Unsupported controls are disabled rather than assumed to work.

### Playback controls

Control the current track from Music widgets in the launcher, Notch, and Dock. Playback is shared across these surfaces, while seeking, shuffle, and favorites depend on the player’s capabilities.

Use **Play / Pause**, **Previous track**, and **Next track** on a Music widget. A progress control lets you seek when the source reports a usable track duration and supports the command.

The player shown in the full-screen launcher, Notch, and Dock is shared. Pausing a track from one surface updates the others. Each widget's visual style can still be different.

#### Shuffle and favorites

Launcher and notch Music widgets can expose **Shuffle** for Spotify and Apple Music. The heart control marks or unmarks the current track as a favorite in Apple Music.

The source determines which controls are meaningful. Browser and other system sessions do not have the native player's shuffle or favorite integration.

### Launcher and notch widgets

Choose a Music widget style for the full-screen launcher or Notch, including cover, minimal, and vinyl layouts. Music widgets require Pro; available styles depend on the selected widget size.

Add **Music** from the launcher or notch widget picker. Right-click the widget to edit it. Music widgets require **Pro**.

#### Full Cover

The album artwork fills the widget. Playback controls and track information sit over it. This style supplies its own artwork background, so the normal shared widget background controls do not apply.

#### Half Cover

Half Cover separates artwork from the track information area. It is offered only for widget sizes that support the layout. If it is missing from the style choices, select a supported widget size.

#### Minimal

Minimal emphasizes the track information and controls. Use its supported background settings to fit the widget into the rest of the page.

#### Vinyl

Vinyl shows a record presentation. In its editor, choose **Vinyl appearance → Song cover** to use the current track's artwork, or **Custom vinyl photo** for your own image.

Click **Choose image**, move the image in the crop view, and pinch or use the slider to zoom. **Apply** saves the crop; **Cancel** leaves the previous image. **Remove image** removes your custom photo.

The record spins during playback when motion is enabled. Pausing playback stops the spinning presentation.

### Dock players

Choose a Dock music layout with compact controls, artwork, or a vinyl presentation. Changing the Music design updates the Dock’s existing Music widget rather than creating a second player.

Right-click the Dock, choose **Widgets → Music**, and select a design. Choosing another Music design updates the Dock's Music widget rather than adding a second independent player.

#### Compact player and Full player

**Compact player** keeps the card smaller. **Full player** gives track information and playback more room.

Both also have **Buttons on hover** versions. Those keep the controls tucked away until you point at the widget. If you see track information but no buttons, move the pointer over the card before changing styles.

#### Cover player and Wide cover player

These layouts combine artwork with the track information. The wide version uses more horizontal space. Click the artwork's full-screen target to open the larger player.

#### Album cover

Album cover gives the artwork its own compact tile. With no current track, the widget offers Apple Music and Spotify launch options. When access is needed, use **Connect player**.

Artwork depends on the source. A track without available cover art uses a placeholder.

#### Vinyl Adaptive

Vinyl Adaptive uses the track artwork for the record presentation. The gallery offers different widths and shapes, so choose a size that leaves room for the other Dock items.

#### Vinyl Customizable

Vinyl Customizable lets you use a custom record photo. Right-click it, choose **Edit widget**, and use the vinyl image controls. Import an image, adjust the circular crop, then apply it.

The vinyl layouts share the same song-cover and custom-photo choices. Clicking the record opens the full-screen player. Its chosen custom image can be carried into that presentation.

### Full-screen player

Open the larger music player to display album artwork, vinyl, or audio-reactive visuals. Spotify and Apple Music use Automation for controls, while reactive effects need separate system audio capture access.

Click **Full screen** on a launcher or notch Music widget. Dock cover and vinyl layouts also provide an artwork or record target that opens it.

The player replaces the launcher grid with artwork and a control bar. Use **Exit full screen** to return. The way LaunchMe stays open follows the launcher's **Always On** setting.

#### Seeking

Move the pointer over the track title and artist area in the control bar. The artist line changes to a timeline with elapsed and total time. Click or drag the progress bar to move within the track.

If a source does not provide a usable duration or cannot seek, it cannot offer the same timeline behavior as a normal song in Spotify or Apple Music.

#### Artwork menu

Open **Artwork** to choose what fills the screen:

- **Album cover:** always use the still cover.
- **Auto:** use animated artwork when it is available, otherwise the still cover.
- **Vinyl:** show the record and sleeve presentation.
- **Particles:** show an audio-reactive particle presentation.

The choice is remembered. Animated artwork is not available for every track or source, so Auto may look the same as Album cover for some songs.

#### Vinyl style

With Vinyl selected, open **Vinyl style**:

- **Standard Vinyl:** the standard record material.
- **Colored Vinyl:** a colored record presentation.
- **Waves:** a patterned vinyl material.

This controls the full-screen record's material. The custom photo in a widget is managed from that widget's vinyl editor.

#### Glowing Beats

Click the waveform control to open **Glowing Beats**. Enable the effect for a glow that responds to the current player's audio.

Use **Thickness** to change the edge's width and **Glow** to change its strength. Colors are taken from the album artwork unless **Custom colors** is enabled. With custom colors on, choose **Primary** and **Secondary**. **Reset** restores the settings provided by the panel.

Glowing Beats needs system audio capture permission. It is separate from the Automation permission used by play and pause.

#### Particles

Choose **Artwork → Particles** for the audio-reactive filament and particle view. Open **Particle settings** to choose **Light background** or **Dark background**.

Particles use the current player's audio. A paused track or missing capture access will not produce the same response as active playback. The particle view uses its own presentation in place of the edge glow.

#### Audio permission

If the player reports **No audio received**, check that music is playing and allow LaunchMe in the relevant **System Audio Recording** section of macOS Privacy & Security settings. Use **Privacy Settings** in the notice to open the settings and **Retry** after granting access.

The macOS section name can differ between versions. This access is needed for reactive visuals, not for every music display. You can turn Glowing Beats off or choose Album cover while resolving it.

### Music Wallpaper

Show album artwork behind the full-screen launcher while music plays. Music Wallpaper requires Pro and returns to your selected wallpaper when playback pauses or stops.

Open **Settings → Appearance → Music Wallpaper** in the full-screen launcher. When music plays, LaunchMe shows automatic album artwork behind the launcher. When playback pauses or stops, your selected wallpaper returns.

Music Wallpaper requires **Pro**. It affects the launcher background. The Dock's **Glowing** widget changes the macOS desktop wallpaper separately.

### Background Sounds

Play ambient Background Sounds from a Dock widget with its own volume control. Each sound downloads on first playback and can then play offline while its local download is retained.

Open **Dock → Widgets → Mindfulness** and add **Background Sounds**. Use the sound selector to choose an ambience, then press play. The widget's slider controls its volume.

#### Sound collection

The collection includes:

- **Balanced Noise**, **Bright Noise**, and **Dark Noise**.
- **Ocean**, **Rain**, **Stream**, **Fire**, and **Night**.
- **Rain on Roof** and **Quiet Night**.
- **Babble** and **Steam**.
- **Airplane**, **Boat**, **Bus**, and **Train**.

Choose another sound while playing to switch to it. Pause from the widget when you want silence.

#### First download and offline playback

A sound downloads on first playback. While it loads, use **Cancel loading** to stop the request. Once downloaded and retained locally, it is available offline.

If the sound fails to play, check your connection and try again. Music in Spotify or Apple Music and Background Sounds are separate playback sources; the sound widget has its own volume.

#### What happens when the Dock hides

Hiding the Dock does not interrupt Background Sounds. Removing the widget, disabling the Dock, or switching to a Dock Space without that widget stops playback.

The sound player is shared across displays, so showing the Dock on several screens does not start several copies of the same ambience.

### Troubleshooting

Resolve player connections, unavailable controls, still artwork, reactive effects, and Background Sounds interruptions. Music controls and audio-reactive visuals use different macOS permissions.

#### “Play something in Music or Spotify”

Open the player and start a track. If you are using another source, check that it appears in macOS Now Playing. Start with one playing source while checking the connection.

#### Connect player does not show a permission dialog

Open Spotify or Apple Music before clicking it. If permission was denied earlier, enable it manually in **System Settings → Privacy & Security → Automation**.

#### Track information appears, but a control is disabled

The source may not support that action. Shuffle and Apple Music favorites use the native player connections. Some system Now Playing sources also restrict seeking or skipping.

#### The artwork is still rather than animated

Choose **Artwork → Auto** in the full-screen player. The track must have matching animated artwork; Album cover deliberately keeps the still image. Motion can also be reduced by macOS accessibility settings.

#### A reactive effect does not move

Confirm playback, allow system audio recording, then use **Retry**. Automation access alone does not grant audio capture. If the renderer is unavailable on the device, use a still-artwork or vinyl presentation.

#### Background Sounds stopped after switching Spaces

The active Dock Space must contain the Background Sounds widget. Hiding the Dock keeps audio going, but switching to a setup without the widget stops it.
