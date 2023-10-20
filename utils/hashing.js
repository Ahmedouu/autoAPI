const crypto = require('crypto')

function HASHER(content) {
    
    console.log("printing content in trim" + content);
    content = content.trim();
  
    content = content.replace(/\r?\n|\r/g, '');
  
    
    content = content.replace(/<!--[\s\S]*?-->/g, '');
  
    content = content.replace(/\s+/g, ' ');
    const hash = crypto.createHash('sha256');
  
    hash.update(content);
    return hash.digest('hex');
  }




module.exports = { HASHER }