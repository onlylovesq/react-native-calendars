import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { shouldUpdate } from '../../../component-updater';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    markMessage: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    // return true;
    return shouldUpdate(this.props, nextProps, [
      'state',
      'children',
      'marking',
      'markMessages',
      'onPress',
      'onLongPress',
    ]);
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    let markMessage = this.props.markMessage || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true,
      };
    }

    if (markMessage && markMessage.constructor === Array && markMessage.length) {
      markMessage = {
        markMessage: true,
      };
    }
    const isDisabled =
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled';
    let dot;
    let showText;
    if (marking.marked) {
      dotStyle.push(this.style.visibleDot);
      if (marking.dotColor) {
        dotStyle.push({ backgroundColor: marking.dotColor });
      }

      dot = <View style={dotStyle} />;
    }

    if (markMessage.showText) {
      // console.log('showText', marking.showText);
      showText = <View>{markMessage.showText}</View>;
    }
    // console.log('marking.selected', marking.selected);
    if (marking.selected) {
      containerStyle.push(this.style.selected);
      if (marking.selectedColor) {
        containerStyle.push({ backgroundColor: marking.selectedColor });
      }
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }

    return (
      <View>
        <TouchableOpacity
          style={containerStyle}
          onPress={this.onDayPress}
          onLongPress={this.onDayLongPress}
          activeOpacity={marking.activeOpacity}
          disabled={marking.disableTouchEvent}
        >
          <Text allowFontScaling={false} style={textStyle}>
            {String(this.props.children)}
          </Text>
          {dot}
        </TouchableOpacity>
        {showText}
      </View>
    );
  }
}

export default Day;
