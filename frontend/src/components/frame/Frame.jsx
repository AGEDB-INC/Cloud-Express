/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faClone,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Popover } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './Frame.module.scss';
import { removeFrame } from '../../features/frame/FrameSlice';
import { setCommand } from '../../features/editor/EditorSlice';
import { removeActiveRequests } from '../../features/cypher/CypherSlice';
import EdgeWeight from '../../icons/EdgeWeight';
import IconFilter from '../../icons/IconFilter';
import IconSearchCancel from '../../icons/IconSearchCancel';

const Frame = ({
  reqString,
  children,
  refKey,
  onSearch,
  onSearchCancel,
  onThick,
  // eslint-disable-next-line react/prop-types
  thicnessMenu: thicknessMenu,
  bodyNoPadding,
  isTable,
}) => {
  const dispatch = useDispatch();
  const [isFullScreen] = useState(false);
  const [isExpand, setExpand] = useState(true);

  return (
    <div className={`${styles.Frame} ${isFullScreen ? styles.FullScreen : ''}`}>
      <div className={styles.FrameHeader}>
        <div className={styles.FrameHeaderText}>
          {'$ '}
          <strong>
            {reqString}
          </strong>
          <FontAwesomeIcon
            id={styles.toEditor}
            title="copy to editor"
            icon={faClone}
            size="s"
            onClick={() => dispatch(setCommand(reqString))}
            style={{
              cursor: 'pointer',
            }}
          />
        </div>
        <div className={styles.ButtonArea}>
          {!isTable && onThick ? (
            <Popover placement="bottomLeft" content={thicknessMenu} trigger="click">
              <Button
                size="large"
                type="link"
                className={styles.FrameButton}
                title="Edge Weight"
                onClick={() => onThick()}
              >
                <EdgeWeight />
              </Button>
            </Popover>
          ) : null}
          {onSearchCancel ? (
            <Button
              size="large"
              type="link"
              className={styles.FrameButton}
              onClick={() => onSearchCancel()}
              title="Cancel Search"
            >
              <IconSearchCancel />
            </Button>
          ) : null}
          {onSearch ? (
            <Button
              size="large"
              type="link"
              className={styles.FrameButton}
              onClick={() => onSearch()}
              title="Filter/Search"
            >
              <IconFilter />
            </Button>
          ) : null}
          <Button
            size="large"
            type="link"
            className={styles.FrameButton}
            onClick={() => setExpand(!isExpand)}
            title={isExpand ? 'Hide' : 'Show'}
          >
            <FontAwesomeIcon
              icon={isExpand ? faAngleUp : faAngleDown}
              size="lg"
            />
          </Button>
          <Button
            size="large"
            type="link"
            className={styles.FrameButton}
            onClick={() => {
              if (window.confirm('Are you sure you want to close this window?')) {
                dispatch(removeFrame(refKey));
                dispatch(removeActiveRequests(refKey));
              } else {
                // Do nothing!
              }
            }}
            title="Close Window"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </Button>
        </div>
      </div>
      <div
        className={`${styles.FrameBody} ${isExpand ? '' : styles.Contract} ${
          bodyNoPadding ? styles.NoPadding : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

Frame.defaultProps = {
  onSearch: null,
  onThick: null,
  onSearchCancel: null,
  // eslint-disable-next-line react/default-props-match-prop-types
  thicknessMenu: null,
  bodyNoPadding: false,
};

Frame.propTypes = {
  reqString: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  refKey: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
  onThick: PropTypes.func,
  // eslint-disable-next-line react/require-default-props, react/no-unused-prop-types
  thicknessMenu: PropTypes.func,
  onSearchCancel: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
  onRefresh: PropTypes.func,
  bodyNoPadding: PropTypes.bool,
  isTable: PropTypes.bool.isRequired,
};

export default Frame;
