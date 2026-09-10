'use client';

import React from 'react';
import TemplateComponent from './src/template';

export default function Template(props: any) {
  return <TemplateComponent {...props} />;
}

export { TemplateComponent as Portfolio };
