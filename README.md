<h1 align="center">Welcome to VitalSys 👋</h1>
<p>
</p>

> A system and tutorial demonstrating the capabilities of chaos engineering. Although chaos engineering might sound frightening, it is actually a constructive and commonly used practice that originated at Netflix and has been adopted by companies like Microsoft, Facebook, and Visa. The chaos engineer brings about controlled failures to test the vulnerabilities and weaknesses of a complex, distributed system. They aim to make these systems resilient enough to withstand network outages that are inevitable in a massive, distributed, cloud-based deployments.

This site uses Docker containers and an AWS service-oriented architecture to maintain a simple system, which rebuilds itself when you break it. We've encased a flock of paper airplanes in an embedded VR canvas and provided a button that causes random destruction in this canvas when you press it. Each paper plane in the canvas is actually a clone of our 'litbot' service, which outputs a Markov Chain-generated text (based on John Milton's depictions of Chaos in Paradise Lost) at the moment a plane is destroyed. The circling planes function as a system of litbot services, which maintains its steady state and replenishes litbots/planes when any go down. VitalSys is designed both to be broken and to remain up-and-running in spite of temporary chaos.  

Follow the tutorial on the site, wreak some chaos, and clone/adapt this repository (along with https://github.com/matthiasquintero/vitalsys-frontend) for your own projects!  

![](VitalSysImg.png)

### 🏠 [Homepage](http://vital-sys.s3-website.us-east-2.amazonaws.com/)

### ✨ [Demo](http://vital-sys.s3-website.us-east-2.amazonaws.com/)

## Author

👤 **M. Milagro Quintero & Matt Reilly**


## Show your support

Give a ⭐️ if this project helped you!

