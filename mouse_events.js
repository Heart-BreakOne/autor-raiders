//Scroll into view the center of the currentMark
async function moveScreenCenter(marker) {

    //Set marker dimensions to zero so the unit can fit in its place
    try {
      marker.style.width = '0';
      marker.style.height = '0';
      marker.style.backgroundSize = '0';
  
      //Move screen so the current marker gets centered
      await delay(1000);
      if (marker && marker !== undefined && marker !== null) {
        marker.scrollIntoView({ block: 'center', inline: 'center' });
      } else {
        goHome();
        return;
      }
      await delay(1000);
    } catch (error) {
      goHome();
      return;
    }
  }
  
  //If the unit is in a valid marker that is in use, by taping the unit container it forces a button recheck on mouseup/touchend
  function tapUnit() {
    //Check for frozen state
    reloadRoot()
    //Attemps to tap the selected unit to force a valid placement check
    try {
      const placerUnitCont = document.querySelector('.placerUnitCont');
      const event = new Event('mouseup', { bubbles: true, cancelable: true });
      placerUnitCont.dispatchEvent(event);
    } catch (error) {
      goHome();
      return true;
    }
  }

  function simulateMouseEvent(element, eventName, clientX, clientY) {
    const event = new MouseEvent(eventName, {
      bubbles: true,
      cancelable: true,
      clientX: clientX,
      clientY: clientY
    });
    element.dispatchEvent(event);
  }
  
  function clickHoldAndScroll(element, deltaY, duration) {
    try {
      const rect = element.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top + rect.height / 2;
  
      simulateMouseEvent(element, "mousedown", clientX, clientY);
  
      const interval = 10;
      const steps = Math.ceil(duration / interval);
      const stepSize = deltaY / steps;
      let cumulativeDeltaY = 0;
      let step = 0;
      const scrollInterval = setInterval(() => {
        if (step < steps) {
          cumulativeDeltaY += stepSize;
          simulateMouseEvent(element, "mousemove", clientX, clientY + cumulativeDeltaY);
          step++;
        } else {
          clearInterval(scrollInterval);
          simulateMouseEvent(element, "mouseup", clientX, clientY + cumulativeDeltaY);
        }
      }, interval);
    } catch (error) {
      console.log(error)
    }
  
  }