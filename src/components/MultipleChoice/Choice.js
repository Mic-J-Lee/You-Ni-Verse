import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import AudioButton from './AudioButton'
import PictureButton from './PictureButton'
import { _loadSoundObject } from './helpers'

export default class Choice extends Component {
  componentWillMount() {
    this.animatedValue = new Animated.ValueXY()
  }

  componentDidUpdate(prevProps) {
    this.props.status == 'animating' && this.props.isCorrect && setTimeout(()=>this.exitScreenInTriumph(), 450)
    this.props.status == 'animating' && !this.props.isCorrect && setTimeout(()=>this.exitScreenInDespair(), Math.random() * 300)
    this.props.status == 'ready' && prevProps.status == 'animating' && this.enterScreen(()=>{this.animatedValue.setValue({ x: 0, y: 0})})
    this.props.activeColor != prevProps.activeColor && this.enterScreen()

  }

  enterScreen() {
    this.animatedValue.setValue({ x: 0, y: -500})
    Animated.spring(
      this.animatedValue,
      { 
        toValue: {x: 0, y: 0},
        useNativeDriver: true,
        duration: 500,
      }
    ).start()
  }

  exitScreenInTriumph() {
    this.animatedValue.setValue({ x: 0, y: 0})
    Animated.timing(
      this.animatedValue,
      { 
       toValue: {x: -500, y: 0},
       useNativeDriver: true,
       duration: 500,
       easing: Easing.cubic
      }
    ).start()
  }

  exitScreenInDespair() {
    this.animatedValue.setValue({ x: 0, y: 0})
    Animated.timing(
      this.animatedValue,
      { 
       toValue: {x: 0, y: 300},
       useNativeDriver: true,
       duration: 500,
       easing: Easing.cubic
      }
    ).start()
  }

  _checkIfCorrect = () => {
    if (this.props.isCorrect) {
      this.props._nextColor()
    } else {
      this.props._wrongGuess(this.props.content)
    }
  }

  render() {
    const content = this.props.content
    const audioButton = (
      <Animated.View style={{transform: this.animatedValue.getTranslateTransform()}} >
        <AudioButton 
          sound={content} 
          size='small' 
          soundObject={_loadSoundObject(content)} 
          isCorrect={this.props.isCorrect} 
          _checkIfCorrect={this._checkIfCorrect}
          disabled={this.props.wrongGuesses.includes(content)} />
      </Animated.View>
    )
    const pictureButton = (
      <Animated.View style={{transform: this.animatedValue.getTranslateTransform()}} >
        <PictureButton 
          picture={content}
          size='small' 
          isCorrect={this.props.isCorrect} 
          _checkIfCorrect={this._checkIfCorrect}
          disabled={this.props.wrongGuesses.includes(content)} 
          style={{transform: this.animatedValue.getTranslateTransform()}} />
      </Animated.View>
    )

    return (
      this.props.type == 'audio' ? audioButton : pictureButton
    )
  }
}
