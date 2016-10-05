"user strict"
var name = $namespace( "_$" );

function queryAll( _selector, _context) {
	if ( !_context ) {
		_context = document;
	}

	if ( typeof _context === 'string' ) {
		_context = query( _context );
	}

	// context.length 속성 유무에 따라 코드 분기
	if ( _context.length ) {
		// _nodeList는 호이스트 되지만,
		// 아래 코드에서는 큰 문제가 발생하지 않음.
		var _nodeList = [];
		// 헬퍼함수 each 재사용
		each( _context, function( _item ){
		// 마치 2중 for 문처럼 다시 each 함수 사용
			each(query( _selector, _item), function( _item ){
				_nodeList.push( _item );
			});
		});
		// 수집된 _nodeList 반환
		return _nodeList;
	} else {
		// context 객체가 하나일 경우, 간단하게 결과 반환
		return _context.querySelectorAll( _selector );
	}
}

function query( _selector, _context ) {
	return queryAll( _selector, _context)[0];
}

name.queryAll = queryAll;
name.query 	 = query;