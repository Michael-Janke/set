/* eslint-disable react/jsx-props-no-spreading */
import React, {
  ElementType, ComponentProps, Props, ClassAttributes, HTMLAttributes
} from 'react';
import './Card.css';
import classNames from 'classnames';
import PropTypes, { InferProps } from 'prop-types';


interface CardProps<T> extends P<T> {
  Component: T,
  className: string;

}

const Card: React.FC<CardProps<ElementType>> = ({
  Component,
  className,
  ...other
}: CardProps<ElementType>) => <Component className={classNames('Card', className)} {...other} />;


export default Card;
