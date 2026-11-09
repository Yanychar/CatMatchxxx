import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as categoryMatcherActions from "./lib/categoryMatcherActions";
import CategoryMatcher from "./lib/CategoryMatcher";

function mapStateToProps(state) {
    return {
        category: state.category,
        categoryProducts: state.categoryProducts,
        sourceCatalog: state.sourceCatalog,
        marketplaces: state.marketplaces,
        marketplaceId: state.marketplaceId,
        externalCatalog: state.externalCatalog,
        selectedProductId: state.selectedProductId,
        productSuggestions: state.productSuggestions,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        cma:bindActionCreators(categoryMatcherActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryMatcher)
