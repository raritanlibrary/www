# **Raritan Public Library Website Source**
This repository contains the source code for Raritan Public Library's website.

## **Installation**

### **Node.js/npm**
First, download or clone the latest version of this repository. Once you have the repository downloaded in a suitable location, run the following commands to check to make sure you have **Node.js** and **npm** installed.
```
node --version
npm --version
```
Then, run the following command to install the necessary npm packages.
```
npm install
```

### **WinSCP**
If you are running Windows, we will need **WinSCP** in order to communicate with the server. [Install it](https://winscp.net/eng/download.php) and test it via the command line (below is the default install location):
```
"C:\Program Files (x86)\WinSCP\WinSCP.com"
```
If you are using macOS or a Linux distribution, you can modify these scripts to use **`ssh`** rather than WinSCP.

### **7zip**
Next, we will need to download **7zip** in order to package and send our distribution directory. If you are using Windows, [install it](https://www.7-zip.org/download.html) and test it via the command line:
```
7z
```
If you are using macOS or a Linux distribution, you can modify these scripts to use the **`zip`** command rather than 7zip.

### **ImageMagick**
In order to generate some static content, we will need to download **ImageMagick** to use in the command line. You can download the [installer for Windows](https://imagemagick.org/script/download.php), or if you are using Ubuntu or Debian, run the following command:
```
apt-get install imagemagick
```
Then, run the following command to ensure it is installed correctly:
```
magick
```

### **Environment variables**
Once you have the repository downloaded and necessary programs installed, you'll need to set up an `.env` file with the following variables before running any scripts.
- **`h`** - The hostname for the SSH server to connect to
- **`u`** - The username to use to connect to the server
- **`k`** - The `.ppk` ([PuTTY](https://www.putty.org/) private key) file to authenticate your identity
- **`LIBCAL_ID`** - The API Authentication ID generated by [LibCal](https://www.springshare.com/libcal/)
- **`LIBCAL_SECRET`** - The API secret hash generated by LibCal

## **Usage**

### **Start dev server**
```
npm run dev
```
This command starts up the development server. You may have to refresh cache (<kbd>CTRL</kbd>+<kbd>F5</kbd>) for new changes to take effect. You can also run `npm run redev` to clear cache when starting the development server, which is useful for when Parcel's hot reloading feature breaks (this is especially problematic with stylesheets).

**NOTE:** When running a development server, the `src/js/main.js` file is modified to better simulate URL behavior. This should automatically reset to normal after the server is shut down, but please make sure that the file remains unchanged from its original state if you did not modify it.

### **Build website**
```
npm run build
```
This command builds the website and sends it to the server to replace the last build immediately.

### **Commit changes + build website**
```
npm run commit
```
This command commits your changes to the repository, then runs the `build` command.

## **Other Useful Commands**
Due to the nature of some software used on the server, you will need to run these commands in specific circumstances.

### **Run Lighthouse audit**
```
npm run lighthouse
```
This command generates webpage audits using Google Chrome's **Lighthouse** tool. The command will automatically generate both desktop and mobile audits for every relevant page in the `src` directory.

### **Automatically update calendar.json**
First, you'll need to create a script that retrieves the new data from the LibCal API. This snippet is taken and modified from the script in [`scripts/generate.sh`](scripts/generate.sh).
```bash
#!/bin/bash

# API variables
LIBCAL_ID=# your LibCal ID
LIBCAL_SECRET=# your LibCal secret token

# Set variables for url and payload
url="https://raritanlibrary.libcal.com/1.1"
payload="client_id=$LIBCAL_ID&client_secret=$LIBCAL_SECRET&grant_type=client_credentials"

# Get and parse oauth token (avoid grep because cmd is strange)
tokenRaw=`curl -Ls -X POST "$url/oauth/token" -d "$payload"`
token=$(cut -c18-57 <<< "$tokenRaw")

# Get proper date for API call
year=$(date --date="$(date) - 45 day" +%Y)
month=$(date --date="$(date) - 45 day" +%B)

# Get current filename of calendar.json
cd #<DIST_PATH>
fname=$(find . -name "calendar.*.json")

# Get and save events data to json file
curl -Ls -X GET "$url/events?cal_id=16676&days=160&limit=500&date=$year-$month-01" -H "Authorization: Bearer $token" > "$fname"
```

Then, create a batch file on your Windows Server:
```cmd
@echo off
"<SH.EXE_PATH>" -c "bash <SHELL_SCRIPT_PATH>"
```

Finally, run this command in an elevated instance of Command Prompt.
```cmd
schtasks /create /tn rpl_calendar_update /tr "<BATCH_FILE_PATH>" /sc minute /mo 30 /ru "<COMPUTER_NAME>\<USERNAME>"
```

## **Issues and Contributing**
Pull requests are encouraged by the Raritan Public Library to ensure our software is of the highest quality possible. If you would like to suggest major changes or restructuring of this repository, please [open an issue](https://github.com/raritanlibrary/www/issues/new). It is also strongly suggested you email us at [info@raritanlibray.org](mailto:info@raritanlibray.org) with any additional questions or concerns.

## **License**
Please note that, while this project is made available under the [MIT License](LICENSE), any original written, visual, or otherwise presented content is copyrighted by the Raritan Public Library.