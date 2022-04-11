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

### **Run Lighthouse audit**
```
npm run lighthouse
```
This command generates webpage audits using Google Chrome's **Lighthouse** tool. The command will automatically generate both desktop and mobile audits for every relevant page in the `src` directory.

## **Issues and Contributing**
Pull requests are encouraged by the Raritan Public Library to ensure our software is of the highest quality possible. If you would like to suggest major changes or restructuring of this repository, please [open an issue](https://github.com/raritanlibrary/www/issues/new). It is also strongly suggested you email us at [raritanlibrary54@aol.com](mailto:raritanlibrary54@aol.com).

## **License**
Please note that, while this project is made available under the [MIT License](LICENSE), any original written, visual, or otherwise presented content is copyrighted by the Raritan Public Library.